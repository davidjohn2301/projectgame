import React, { useState, useEffect } from 'react'
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { useAuthStore } from 'store/auth'
import { firestore } from 'lib/firebase'
import { formatPoints } from 'utils/currencyFormat'
import classNames from 'classnames'

interface Withdraw {
  id: string
  createdAt: string
  amount: number
  address: string
  status: string
}

function History() {
  const [withdraws, setDeposits] = useState<Withdraw[]>([])
  const userId = useAuthStore(state => state.user.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idRef = collection(firestore, 'withdraw/')
        const q = query(
          idRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const items: Withdraw[] = querySnapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as Withdraw)
        )
        // console.log(items.slice(0, 10))
        setDeposits(items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="sm:rounded-lg relative overflow-x-auto shadow-md">
      <table className="w-auto text-center text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="">
              No.
            </th>
            <th scope="col" className="p-2">
              Time
            </th>
            <th scope="col" className="p-2">
              Amount
            </th>
            <th scope="col" className="p-2">
              Wallet Adress
            </th>
            <th scope="col" className="p-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {withdraws.map((withdraw, index) => (
            <tr key={withdraw.id} className="bg-slate-600">
              <td className="whitespace-nowrap font-medium text-white dark:text-white">
                {index + 1}
              </td>
              <td className="p-2 text-white">{withdraw.createdAt}</td>
              <td className="p-2 text-white">{withdraw.amount}</td>
              <td className="p-2 text-white">
                {withdraw.address.slice(10)}......{withdraw.address.slice(-10)}
              </td>
              <td
                className={classNames('p-2', {
                  'text-green-600': withdraw.status === 'Success',
                  'text-cyan-400': withdraw.status === 'Pending',
                  'text-red-600': withdraw.status === 'Fail'
                })}
              >
                {withdraw.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History
