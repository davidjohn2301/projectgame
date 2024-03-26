/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { initializeApp } from 'firebase/app'
import { useDeviceLanguage, getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCy8sn0KGBgA9Oy162RCJoHqPkfJQfe0Vk",
  authDomain: "plinko-a4b5b.firebaseapp.com",
  projectId: "plinko-a4b5b",
  storageBucket: "plinko-a4b5b.appspot.com",
  messagingSenderId: "286719578889",
  appId: "1:286719578889:web:e49f8e65b089bd7664b9d8",
  measurementId: "G-29NKF4RKHL",
  databaseURL: "https://plinko-a4b5b-default-rtdb.firebaseio.com"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const database = getDatabase(app)

export const firestore = getFirestore(app)

useDeviceLanguage(auth)
