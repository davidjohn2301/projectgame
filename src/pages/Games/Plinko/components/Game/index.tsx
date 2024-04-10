import ballAudio from '@sounds/ball.wav'
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  Render,
  Runner,
  World
} from 'matter-js'
import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from 'store/auth'
import { useGameStore } from 'store/game'
import { random } from 'utils/random'

import { LinesType, MultiplierValues } from './@types'
import { BetActions } from './components/BetActions'
import { PlinkoGameBody } from './components/GameBody'
import { MultiplierHistory } from './components/MultiplierHistory'
import { config } from './config'
import {
  getMultiplierByLinesQnt,
  getMultiplierSound
} from './config/multipliers'
import { FirestoreDataTable } from './components/FirestoreDataTable'
import Notification from './components/Notification'

export function Game() {
  const [total, setTotal] = useState(Number)
  let value = 0
  // #region States
  // const userId = useAuthStore(state => state.user.id)
  const incrementCurrentBalance = useAuthStore(state => state.incrementBalance)
  // const setRefEarn = useAuthStore(state => state.setRefEarn)
  const history = useAuthStore(state => state.setHistory)
  const engine = Engine.create()
  const [lines, setLines] = useState<LinesType>(16)
  const inGameBallsCount = useGameStore(state => state.gamesRunning)
  const incrementInGameBallsCount = useGameStore(
    state => state.incrementGamesRunning
  )
  const decrementInGameBallsCount = useGameStore(
    state => state.decrementGamesRunning
  )
  const [lastMultipliers, setLastMultipliers] = useState<number[]>([])
  const {
    pins: pinsConfig,
    colors,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig
  } = config

  const worldWidth: number = worldConfig.width

  const worldHeight: number = worldConfig.height
  // #endregion

  useEffect(() => {
    engine.gravity.y = engineConfig.engineGravity
    const element = document.getElementById('plinko')
    const render = Render.create({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element: element!,
      bounds: {
        max: {
          y: worldHeight,
          x: worldWidth
        },
        min: {
          y: 0,
          x: 0
        }
      },
      options: {
        background: colors.background,
        hasBounds: true,
        width: worldWidth,
        height: worldHeight,
        wireframes: false
      },
      engine
    })
    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)
    return () => {
      World.clear(engine.world, true)
      Engine.clear(engine)
      render.canvas.remove()
      render.textures = {}
    }
  }, [lines])

  const pins: Body[] = []

  for (let l = 0; l < lines; l++) {
    const linePins = pinsConfig.startPins + l
    const lineWidth = linePins * pinsConfig.pinGap
    for (let i = 0; i < linePins; i++) {
      const pinX =
        worldWidth / 2 -
        lineWidth / 2 +
        i * pinsConfig.pinGap +
        pinsConfig.pinGap / 2

      const pinY =
        worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap

      const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
        label: `pin-${i}`,
        render: {
          fillStyle: '#F5DCFF'
        },
        isStatic: true
      })
      pins.push(pin)
    }
  }

  function addInGameBall() {
    if (inGameBallsCount > 15) return
    incrementInGameBallsCount()
  }

  function removeInGameBall() {
    decrementInGameBallsCount()
  }

  const addBall = useCallback(
    (ballValue: number) => {
      addInGameBall()
      const ballSound = new Audio(ballAudio)
      ballSound.volume = 0.2
      ballSound.currentTime = 0
      ballSound.play()

      const minBallX =
        worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap - 5
      const maxBallX =
        worldWidth / 2 -
        pinsConfig.pinSize * 3 -
        pinsConfig.pinGap +
        pinsConfig.pinGap / 2 +
        5

      const ballX = random(minBallX, maxBallX)
      console.log(ballX)
      const ballColor = ballValue <= 0 ? colors.text : colors.purple
      const ball = Bodies.circle(ballX, 30, ballConfig.ballSize, {
        restitution: 0.8, //chinh toc do va cham
        friction: 0.14, //chinh toc do truot
        label: `ball-${ballValue}`,
        id: new Date().getTime(),
        frictionAir: 0.045, //chinh toc do nay
        collisionFilter: {
          group: -1
        },
        render: {
          fillStyle: ballColor
        },
        isStatic: false
      })
      Composite.add(engine.world, ball)
    },
    [lines]
  )

  const leftWall = Bodies.rectangle(
    worldWidth / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap,
    worldWidth / 2 - pinsConfig.pinSize,
    worldWidth * 2,
    40,
    {
      angle: 90,
      render: {
        visible: false
      },
      isStatic: true
    }
  )
  const rightWall = Bodies.rectangle(
    worldWidth -
      pinsConfig.pinSize * pinsConfig.pinGap -
      pinsConfig.pinGap -
      pinsConfig.pinGap / 2,
    worldWidth / 2 - pinsConfig.pinSize,
    worldWidth * 2,
    40,
    {
      angle: -90,
      render: {
        visible: false
      },
      isStatic: true
    }
  )
  const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
    label: 'block-1',
    render: {
      visible: false
    },
    isStatic: true
  })
  const multipliers = getMultiplierByLinesQnt(lines)

  const multipliersBodies: Body[] = []

  let lastMultiplierX: number =
    worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap

  multipliers.forEach(multiplier => {
    const blockSize = 20 // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + 20,
      worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: 1,
            yScale: 1,
            texture: multiplier.img
          }
        }
      }
    )
    lastMultiplierX = multiplierBody.position.x
    multipliersBodies.push(multiplierBody)
  })

  Composite.add(engine.world, [
    ...pins,
    ...multipliersBodies,
    leftWall,
    rightWall,
    floor
  ])

  function bet(betValue: number) {
    addBall(betValue)
  }

  async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
    ball.collisionFilter.group = 2
    World.remove(engine.world, ball)
    removeInGameBall()
    const ballValue = ball.label.split('-')[1]
    const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues

    const multiplierSong = new Audio(getMultiplierSound(multiplierValue))
    multiplierSong.currentTime = 0
    multiplierSong.volume = 0.2
    multiplierSong.play()
    setLastMultipliers(prev => [multiplierValue, prev[0], prev[1], prev[2]])

    if (+ballValue <= 0) return
      const newBalance = +ballValue * multiplierValue
      const newBalance1 = +ballValue * multiplierValue * 0.99 //set refferral earnings
      switch (multiplierValue) {
        case 0.5:
          await incrementCurrentBalance(newBalance)
          await history(newBalance, +ballValue, multiplierValue)
          break
        case 0.3:
          await incrementCurrentBalance(+ballValue * multiplierValue)
          await history(newBalance, +ballValue, multiplierValue)
          break
        case 1:
          await incrementCurrentBalance(+ballValue * multiplierValue)
          await history(newBalance, +ballValue, multiplierValue)
          break
        default:
          await incrementCurrentBalance(newBalance1)
          await history(newBalance1, +ballValue, multiplierValue)
          break
      }
    
  }

  async function onBodyCollision(event: IEventCollision<Engine>) {
    const pairs = event.pairs
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair
      if (bodyB.label.includes('ball') && bodyA.label.includes('block'))
        await onCollideWithMultiplier(bodyB, bodyA)
    }
  }

  Events.on(engine, 'collisionActive', onBodyCollision)

  return (
    <div className="">
      <div className="flex h-fit flex-col-reverse items-center justify-center md:flex-row md:px-10 lg:px-20">
        <BetActions
          inGameBallsCount={inGameBallsCount}
          onChangeLines={setLines}
          onRunBet={bet}
        />
        <div>
          <MultiplierHistory multiplierHistory={lastMultipliers} />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <PlinkoGameBody />
        </div>
      </div>
      <div className="flex h-auto flex-col-reverse items-center justify-center gap-4 md:flex-row">
        <FirestoreDataTable />
      </div>
      <Notification />
    </div>
  )
}
