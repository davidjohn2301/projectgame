import { GoogleLogo } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from 'store/auth'
import { firestore } from 'lib/firebase'
import { collection, query, getDocs, where } from 'firebase/firestore'
import toast from 'react-hot-toast'
type LocationState = {
  from?: string
}

export function LoginPage() {
  const location = useLocation()
  const state = location.state as LocationState
  const navigate = useNavigate()
  const signIn = useAuthStore(state => state.signIn)
  const isAuth = useAuthStore(state => state.isAuth)
  const user = useAuthStore(state => state.user)
  const [inputValue, setInputValue] = useState('')
  const [refId, setRefId] = useState(false)
  const [isLocalStorage, setLocalStorage] = useState(false)
  const setUserFireStore = useAuthStore(state => state.setUserFirestore)

  async function checkLocalStorage() {
    const local = localStorage.length
    console.log(local)
    if (local > 0) {
      const localStore = localStorage.getItem('refId')
      if (localStore === null) {
        setLocalStorage(false)
        console.log(localStore)
      } else {
        setInputValue(localStore)
        console.log(inputValue)
        setLocalStorage(true)
      }
      return isLocalStorage
    }
    return isLocalStorage
  }

  useEffect(() => {
    if (state && state.from && isAuth) {
      navigate(state.from)
    }
    checkLocalStorage()
  }, [isAuth])

  const checkRefId = async (inputValue: string) => {
    const idRef = collection(firestore, 'users/')
    const q = query(idRef, where('userId', '==', inputValue))
    const querry = await getDocs(q)
    console.log(querry.size)
    try {
      if (querry.size > 0) {
        setRefId(true)
        return refId
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setRefId(false)
    }
    return refId
  }

  async function handleSignIn() {
    try {
      const isRefId = await checkRefId(inputValue)
      if (inputValue.length > 0 && isRefId === true) {
        alert('Submit Referral ID: ' + inputValue)

        await signIn(inputValue)
        setUserFireStore(inputValue)
        console.log(inputValue)
        navigate('/plinko')
      }
    } catch (error) {
      toast.error('Referral ID not exits')
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-2">
      <span className="text-center text-2xl font-bold text-text">
        Log in to show your scores to other players
      </span>
      <div className="flex items-center justify-center ">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={isLocalStorage === true ? styles.disabledInput : styles.input}
        />
      </div>
      <button
        onClick={handleSignIn}
        style={
          inputValue.length === 0 ? styles.disabledInput : styles.enabledButton
        }
        disabled={inputValue.length === 0}
        className="flex items-center gap-2 rounded-md px-6 py-4 font-bold text-text shadow-sm transition-colors hover:bg-red-700"
      >
        <GoogleLogo size="20" weight="fill" />
        Login with Google
      </button>
    </div>
  )
}
const styles = {
  container: {
    textAlign: 'center',
    margin: 'auto',
    padding: '20px'
  },
  heading: {
    fontSize: '34px',
    marginBottom: '10px',
    color: 'green',
    borderBottom: '3px solid green',
    paddingBottom: 20,
    borderRadius: '8px'
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '200px',
    borderRadius: 8
  },
  disabledInput: {
    backgroundColor: 'gray',
    color: 'white',
    cursor: 'not-allowed',
    margin: 10,
    padding: 15,
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0px 0px 10px 0px grey'
  },
  disabledButton: {
    backgroundColor: 'gray',
    color: 'white',
    cursor: 'not-allowed',
    margin: 10,
    padding: 15,
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0px 0px 10px 0px grey'
  },
  enabledButton: {
    backgroundColor: 'green',
    color: 'white',
    cursor: 'pointer',
    margin: 10,
    padding: 15,
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0px 0px 10px 0px grey'
  }
}
