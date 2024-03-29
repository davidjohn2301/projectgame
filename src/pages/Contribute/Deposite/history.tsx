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
import classNames from 'classnames'
import { formatDate } from 'utils/dateFormat'

interface Deposit {
  id: string
  createdAt: string
  amount: number
  txhash: string
  status: string
}

function History() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const userId = useAuthStore(state => state.user.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idRef = collection(firestore, 'deposite/')
        const q = query(
          idRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const items: Deposit[] = querySnapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as Deposit)
        )
        console.log(items.slice(0, 10))
        setDeposits(items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="sm:rounded-lg relative overflow-x-auto shadow-md ">
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
              Tx Hash
            </th>
            <th scope="col" className="p-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit, index) => (
            <tr key={deposit.id} className="bg-slate-600">
              <td className="whitespace-nowrap font-medium text-white dark:text-white">
                {index + 1}
              </td>
              <td className="p-2 text-white">{deposit.createdAt}</td>
              <td className=" text-white">{deposit.amount}</td>
              <td className="p-2 text-white">{deposit.txhash.slice(10)}......{deposit.txhash.slice(-10)}</td>
              <td
                className={classNames('p-2', {
                  'text-green-600': deposit.status === 'Success',
                  'text-cyan-400': deposit.status === 'Pending',
                  'text-red-600': deposit.status === 'Fail'
                })}
              >
                {deposit.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History
