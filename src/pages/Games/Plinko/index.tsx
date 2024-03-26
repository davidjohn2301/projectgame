import { useEffect } from 'react'
import { useGameStore } from 'store/game'

import { Game } from './components/Game'
import { useAuthStore } from 'store/auth'
import Popup from 'reactjs-popup'

export function PlinkoGamePage() {
  const alertUser = (e: BeforeUnloadEvent) => {
    if (gamesRunning > 0) {
      e.preventDefault()

      e.returnValue = ''
    }
  }
  const user = useAuthStore(state => state.user)
  const gamesRunning = useGameStore(state => state.gamesRunning)

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [gamesRunning])
  return <Game />
}
