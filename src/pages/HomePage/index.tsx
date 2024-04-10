import { get, ref } from 'firebase/database'
import { database } from 'lib/firebase'
import { Profile } from 'pages/Profile'
import { ArrowLeft, CircleDashed, Play } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { User } from './@types/player'
import { ScoreBoardPlayerItem } from './components/ScoreBoardPlayerItem'

interface ScoreBoard {
  currentBalance: number
  user: Omit<User, 'currentBalance'>
}

interface UserWithPosition extends User {
  position: number
}

export function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dbRef = ref(database, 'wallet')
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard[]>([])
  const [userProfile, setUserProfile] = useState<UserWithPosition | undefined>(
    undefined
  )

  useEffect(() => {
    const getScoreBoardData = async () => {
      setIsLoading(true)
      const snapshot = await get(dbRef)
      const data = Object.values(snapshot.val()) as unknown as ScoreBoard[]
      const sortedData = data
        .sort((a, b) => b.currentBalance - a.currentBalance)
        .slice(0, 10)
      setScoreBoard(sortedData)
      setIsLoading(false)
    }

    getScoreBoardData()

    return () => {
      setScoreBoard([])
    }
  }, [])

  return (
    <div className='flex flex-row'>
      <div className="flex h-full items-center justify-center gap-4">
        <div className="bg-purple-300 relative z-30 rounded-xl bg-opacity-50 p-5 text-2xl text-white">
          <video
            autoPlay
            loop
            muted
            className="absolute z-10 min-h-full w-auto min-w-full max-w-none"
          >
            <source src="../src/assets/video/bg.mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex w-4/5 gap-3 rounded bg-primary p-4 text-text">
          <div className="rounded-md bg-background p-1 text-center text-2xl">
            <strong>TOP 10</strong>
            <br /> Best players
            <br />
            <span className="text-xs">
              Click on a player to see their profile
            </span>
          </div>
          {userProfile ? (
            <div className="mx-auto flex w-full  flex-col items-center justify-center">
              <Profile {...userProfile} />
              <button
                onClick={() => setUserProfile(undefined)}
                className="rounded-full bg-background p-2 text-text"
              >
                <ArrowLeft weight="fill" />
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2 lg:mx-auto lg:w-4/5">
              {isLoading ? (
                <div className="flex w-full flex-col items-center justify-center py-4">
                  <CircleDashed
                    className="animate-spin"
                    size="40"
                    weight="bold"
                  />
                  <span className="mt-1 text-sm font-bold">
                    Loading scores...
                  </span>
                </div>
              ) : (
                <>
                  {scoreBoard.map(
                    (
                      { currentBalance, user: { name, profilePic, uid } },
                      index
                    ) => (
                      <ScoreBoardPlayerItem
                        key={uid}
                        onClick={() =>
                          setUserProfile({
                            currentBalance,
                            name,
                            profilePic,
                            uid,
                            position: index
                          })
                        }
                        position={index}
                        player={{
                          name,
                          profilePic,
                          uid,
                          currentBalance
                        }}
                      />
                    )
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <Link
          to="/plinko"
          className="mb-4 flex items-center justify-center gap-4 rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
        >
          <Play weight="fill" size="20" />
          TO PLAY
        </Link>
      </div>
    </div>
  )
}
