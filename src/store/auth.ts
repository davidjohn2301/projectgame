import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import {
  collection,
  query,
  addDoc,
  getDoc,
  getDocs,
  where,
  setDoc,
  doc
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { produce } from 'immer'
import { auth, database, firestore } from 'lib/firebase'
import toast from 'react-hot-toast'
import { formatDate } from 'utils/dateFormat'
import { random } from 'utils/random'
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  profilePic?: string
  refId: string
  availability: boolean
}

interface Wallet {
  address: string
  balance: number
  reedem: boolean
}

interface History {
  userID: string
  createdAt: string
  total: number
}

interface State {
  user: User
  wallet: Wallet
  isAuth: boolean
  isAdmin: boolean
  signIn: (input: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User) => void
  setUserFirestore: (refId: string) => void
  isAuthLoading: boolean
  isWalletLoading: boolean
  setBalance: (balance: number) => void
  setUserdb: (balance: number) => void
  setHistory: (amount: number, ballValue: Number, multiplierValue: number) => Promise<void>
  setBalanceOnDatabase: (balance: number) => Promise<void>
  incrementBalance: (amount: number) => Promise<void>
  decrementBalance: (amount: number) => Promise<void>
  redeemGift: () => Promise<void>
  // setRefEarn: (amount: number) => void
}

function storeUser(user: User) {
  localStorage.setItem('uid', user.id)
  localStorage.setItem('name', user.name)
  localStorage.setItem('profilePic', user.profilePic || '')
  localStorage.setItem('refId', user.refId)
}

function clearUser() {
  localStorage.removeItem('uid')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePic')
}

const userInitialState: User = {
  id: '',
  name: '',
  email: '',
  refId: '',
  availability: false
}

const walletInitialState: Wallet = {
  address: '',
  balance: 0,
  reedem: false
}

export const useAuthStore = create<State>((setState, getState) => ({
  user: userInitialState,
  wallet: walletInitialState,
  isAuthLoading: false,
  isWalletLoading: false,
  isAuth: false,
  isAdmin: false,
  
  setBalance: (balance: number) => {
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
          state.isWalletLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceError', error)
    }
  },
  setHistory: async (amount: number, ballValue: Number, multiplierValue: number) => {
    const userId = getState().user.id
    const refId = localStorage.getItem('refId')
    try {
      if (getState().isAuth) {
        const docRef = await addDoc(collection(firestore, 'history/'), {
          userId: userId,
          refId: refId,
          total: amount,
          ballValue: ballValue,
          multiplierValue: multiplierValue,
          email: getState().user.email,
          createdAt: formatDate(Date.now()),
          earn: false
        })
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  },
  setUserFirestore: async (refId: string) => {
    const userId = getState().user.id
    const docs = collection(firestore, 'users/')
    const q = query(docs, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    console.log(querySnapshot.size)
    try {
      if (querySnapshot.size == 0) {
        const docRef = await setDoc(doc(firestore,"users/", userId), {
          userId: userId,
          refId: refId,
          createdAt: formatDate(Date.now()),
          name: localStorage.getItem('name'),
          email: auth.currentUser?.email,
          profilePic: localStorage.getItem('profilePic'),
          availability: false
        })
      } else {
        console.log('User exist')
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  },
  setUserdb: async (balance: number) => {
    try {
      if (getState().isAuth) {
        const walletRef = ref(database, 'users/' + getState().user.id)
        await set(walletRef, {
          uid: getState().user.id,
          name: localStorage.getItem('name'),
          currentBalance: balance
        })
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  },
  // setRefEarn : async (balance: number) => {
  //   if(balance > 1){
  //     try {
  //       const refEarn = addDoc(collection(firestore, 'refEarn'),{
  //         createdAt: formatDate(Date.now()),

  //       })
  //     } catch (error) {
        
  //     }
  //   }
  // },
  setBalanceOnDatabase: async (balance: number) => {
    try {
      if (getState().isAuth) {
        const walletRef = ref(database, 'wallet/' + getState().user.id)
        await set(walletRef, {
          currentBalance: balance,
          user: {
            uid: getState().user.id,
            name: localStorage.getItem('name'),
            profilePic: localStorage.getItem('profilePic'),
            availability: false
          }
        })
      }
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceOnDatabaseError', error)
    }
  },
  redeemGift: async () => {
    try {
      const balance = getState().wallet.balance
      const reedem = getState().wallet.reedem
      if (balance >= 10 && reedem == true) {
        toast.remove()
        toast.error(
          'You need to have the smallest balance below 10 to redeem the gift'
        )
        return
      }
      const newBalance = random(10, 100)
      setState(
        produce<State>(state => {
          state.wallet.reedem = true
        })
      )
      await getState().setBalanceOnDatabase(newBalance)
      toast.success('Gift redeemed successfully')
      return
    } catch (error) {
      toast.error('An error occurred while redeeming the gift')
      console.error('redeemGiftError', error)
    }
  },
  incrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      // getState().setUserdb(getState().wallet.balance + amount)
      await getState().setBalanceOnDatabase(getState().wallet.balance + amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('incrementBalanceError', error)
    }
  },
  decrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      getState().setUserdb(getState().wallet.balance - amount)
      await getState().setBalanceOnDatabase(getState().wallet.balance - amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('decrementBalanceError', error)
    }
  },
  signIn: async (input: string) => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      const { uid: id, displayName: name, photoURL: profilePic, email } = user
      if (name && email) {
        const newUser = {
          id,
          name,
          email,
          profilePic: profilePic || '',
          refId: input,
          availability: false
        }
        storeUser(newUser)
        setState(
          produce<State>(state => {
            state.user = newUser
            state.isAuth = true
            state.isAuthLoading = false
          })
        )
      }
      setState(state => ({ ...state, isLoading: false }))
    } catch (error) {
      toast.error('An error occurred while login')
      console.error('signInError', error)
    }
  },
  signOut: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      await auth.signOut()
      clearUser()
      setState(
        produce<State>(state => {
          state.user = userInitialState
          state.isAuth = false
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while logout')
      console.error('signOutError', error)
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        produce<State>(state => {
          state.user = user
          state.isAuth = true
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating user data')
      console.error('setUserError', error)
    }
  }
}))
