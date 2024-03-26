import plinkoLogo from '@images/logo.svg'
import classNames from 'classnames'
import { BookOpen, Crown, GameController, Gift, SignOut } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from 'store/auth'
import { useGameStore } from 'store/game'

import { WalletCard } from '../WalletCard'

export function Navbar() {
  const inGameBallsCount = useGameStore(state => state.gamesRunning)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const reedem = useAuthStore(state => state.wallet.reedem)
  const isAuth = useAuthStore(state => state.isAuth)
  const signOut = useAuthStore(state => state.signOut)

  async function handleSignOut() {
    try {
      if (inGameBallsCount <= 0) return
      await signOut()
    } catch (error) {}
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div
        className={classNames('flex h-fit w-full  items-center', {
          'justify-end': isAuth,
          'justify-center': !isAuth
        })}
      >
        <Link
          to={inGameBallsCount ? '#!' : '/'}
          className="w-32 justify-start md:w-80"
        >
          <img src={plinkoLogo} alt="" className="" />
        </Link>
        {isAuth && (
          <div className="flex w-full items-center justify-end gap-2 p-4">
            <Link
              to={inGameBallsCount ? '#!' : '/scores'}
              className="flex items-center justify-center  rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
            >
              <Crown weight="fill" size="20" />
            </Link>
            <Link
              to={inGameBallsCount ? '#!' : '/plinko'}
              className="flex items-center justify-center  rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
            >
              <GameController weight="fill" size="20" />
            </Link>
            <Link
              to={inGameBallsCount ? '#!' : '/results'}
              className="flex items-center justify-center rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
            >
              <BookOpen weight="fill" size="20" />
            </Link>
            {currentBalance < 10 && reedem === false && (
              <Link
                replace
                to={inGameBallsCount ? '#!' : '/gifts'}
                title="Gifts"
                className="animate-bounce text-text transition-colors hover:text-purple "
              >
                <Gift size="32" weight="fill" />
              </Link>
            )}
            <Link
              replace
              to={inGameBallsCount ? '#!' : '/contribute'}
              title="Wallet"
              className=" items-center justify-center text-text transition-colors hover:text-purple "
            >
              <WalletCard balance={currentBalance} showFormatted />
            </Link>
            {/* {inGameBallsCount <= 0 &&(
            <Link
                title="Logout"
                onClick={handleSignOut}
                className="flex items-center justify-center rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple" to={''}>
              <SignOut size="20" weight="fill" />
            </Link>
            )} */}
          </div>
        )}
      </div>
    </nav>
  )
}
