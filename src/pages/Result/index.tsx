import React, { useState, useEffect } from 'react'
import {
  collection,
  query,
  getDocs,
  where,
  orderBy
} from 'firebase/firestore'
import { firestore } from 'lib/firebase'
import { useAuthStore } from 'store/auth'
import { formatPoints } from 'utils/currencyFormat'

interface Item {
  id: string
  createdAt: string
  ballValue: number
  total: number
}

function Result() {
  const userId = useAuthStore(state => state.user.id)
  const [data, setData] = useState<Item[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idRef = collection(firestore, 'history/')
        const q = query(
          idRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const items: Item[] = querySnapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as Item)
        )
        console.log(items.slice(0, 10))
        setData(items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto">
      <div className="mb-200 flex h-fit w-full items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="max-h-screen overflow-y-auto rounded bg-white p-8 shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Bet Value</th>
                <th className="px-4 py-2">Win</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td className="text-center border px-4 py-2">{item.createdAt}</td>
                  <td className="text-center border px-4 py-2">{formatPoints(item.ballValue)}</td>
                  <td className="text-center border px-4 py-2">{formatPoints(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Result
