import classNames from 'classnames'
import { useAuthStore } from 'store/auth'
import {
  Bank,
  Copy,
  Crown,
  CurrencyDollarSimple,
  FinnTheHuman,
  Money,
  SignOut,
  UsersThree,
  Wallet
} from 'phosphor-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { formatPoints } from 'utils/currencyFormat'
import Deposite from './Deposite'
import DepositeHistory from './Deposite/history'
import WithdrawHistory from './Withdraw/history'
import Withdraw from './Withdraw/index'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function Contribute() {
  const user = useAuthStore(state => state.user)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const isAuth = useAuthStore(state => state.isAuth)
  const signOut = useAuthStore(state => state.signOut)
  const [isCopied, setIsCopied] = useState(false)
  async function handleSignOut() {
    await signOut()
  }
  const onCopyText = () => {
    try {
      if (isCopied === false) {
        setIsCopied(true)
        toast.success('Success Copied')
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (error) {
      console.log(error)
      toast.error('Error Copied')
    }
  }
  return (
    <div className="sm:mx-auto sm:rounded-lg md:mx-auto lg:mx-auto flex flex-col items-center justify-center gap-2 rounded-md bg-primary text-text">
      <div className="relative mx-auto w-32 rounded-full">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            referrerPolicy="no-referrer"
            alt={user.name + ' Avatar'}
            className="w-full rounded-full"
          />
        ) : (
          <FinnTheHuman size="full" weight="fill" />
        )}

        <Crown
          className={classNames(
            'absolute -right-2 bottom-0 text-yellow-400 transition-colors'
          )}
          weight="fill"
          size="40"
        />
      </div>
      <span
        className={classNames('text-center text-2xl font-bold', {
          'text-purple': user.id === user.id
        })}
      >
        {user.name || 'Anonymous Player'} {user.id === user.id}
      </span>
      <Link
        title="Logout"
        onClick={handleSignOut}
        className="flex items-center justify-center rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
        to={''}
      >
        <p className="mr-4">Logout</p>
        <SignOut size="20" weight="fill" />
      </Link>
      <div className="flex items-center gap-3">
        <Wallet size={32} />
        <span className="text-center text-xl font-bold">
          Balance: {formatPoints(currentBalance)}
        </span>
      </div>
      <div className="flex flex-row items-center justify-center gap-3 p-1">
        <Link to={'/rewards'}>
        <span className="sm:text-xl text-2xl font-bold text-green-600">
          <UsersThree size={32} />
        </span>
        </Link>
        <div className="flex items-center justify-center rounded-lg outline outline-offset-2 outline-cyan-500">
          {user.id}
        </div>
        <CopyToClipboard text={user.id} onCopy={onCopyText}>
          <button>
            <Copy size={32} />
          </button>
        </CopyToClipboard>
      </div>
      <div className="flex flex-col items-center justify-center">
        {isAuth && (
          <>
            <div className="flex flex-col items-center justify-center">
              <Link to={'/deposite'}>
                <button className="text-bold mb-2 me-2 flex items-center justify-center rounded-lg bg-gradient-to-br from-purpleDark to-fuchsia-600 px-5 py-2.5 text-center font-bold text-white hover:bg-gradient-to-bl ">
                  <p className="mr-4">Deposite</p>
                  <Bank size={32} />
                </button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Link to={'/withdraw'}>
                <button className="text-bold mb-2 me-2 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-800 to-cyan-300 px-5 py-2.5 text-center font-bold text-white hover:bg-gradient-to-bl ">
                  <p className="mr-4">Withdraw</p>
                  <Money size={32} />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="sm:mx-auto md:mx-auto lg:mx-auto flex max-w-sm flex-col items-center justify-center gap-3 p-3">
        <strong className="items-center justify-center rounded-lg outline outline-offset-2 outline-cyan-500">
          Deposite History
        </strong>
        <DepositeHistory />
      </div>
      <div className="flex flex-col items-center justify-center gap-3 p-3 ">
        <strong className="items-center justify-center rounded-lg outline outline-offset-2 outline-cyan-500">
          Withdraw History
        </strong>
        <WithdrawHistory />
      </div>
    </div>
  )
}
