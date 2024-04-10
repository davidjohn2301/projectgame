import React, { useState, useEffect } from 'react'
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import { useAuthStore } from 'store/auth'
import { firestore } from 'lib/firebase'
import classNames from 'classnames'

interface Rewards {
  id: string
  createdAt: string
  multiplierValue: number
  refId: string
  email: string
  total: number
  earn: boolean
}

function Rewards() {
  const [deposits, setDeposits] = useState<Rewards[]>([])
  const [datas, setData] = useState<Rewards[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const refId = useAuthStore(state => state.user.id)
  console.log(refId)
  const user = useAuthStore()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idRef = collection(firestore, 'history/')
        const q = query(
          idRef,
          where('refId', '==', refId),
          orderBy('createdAt', 'desc')
        )
        let items: Rewards[] = []
        let items1: Rewards[] = []
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
          const earn = doc.data().earn
          const multiplierValue = doc.data().multiplierValue
          console.log(doc.data())
          if (multiplierValue > 1 && earn === false) {
            items.push({ id: doc.id, ...doc.data() } as Rewards)
          }
          if(multiplierValue > 1 && earn === true){
            items1.push({ id: doc.id, ...doc.data()} as Rewards)
          }
        })
        setData(items1)
        console.log(items)
        setDeposits(items)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  async function handleReward(): Promise<void> {
    setIsLoading(true)
    try {
      console.log(deposits.length)
      for (var i = 0; i < deposits.length; i++) {
        const earn = deposits[i].total / 49
        user.incrementBalance(earn)
        const earnRef = doc(firestore, 'history/', deposits[i].id)
        await updateDoc(earnRef, {
          earn: true
        })
        
      }
      setIsLoading(false)
    } catch (error) {}
    window.location.reload()
  }

  return (
    <div className="container mx-auto ">
      <div className="mb-200 flex h-fit w-full items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="max-h-screen overflow-y-auto rounded bg-white p-8 shadow-lg">
          <div className="border px-4 py-2 text-center uppercase text-white bg-slate-900">
            <p>Earning...</p>
          </div>
          <table className="min-w-full">
            <thead className="text-xs uppercase">
              <tr>
                <th scope="col" className="px-4 py-2 border">
                  No.
                </th>
                <th scope="col" className="px-4 py-2 border">
                  Time
                </th>
                <th scope="col" className="px-4 py-2 border">
                  Referral
                </th>
                <th scope="col" className="px-4 py-2 border">
                  Earn
                </th>
                <th scope="col" className="px-4 py-2 border">
                  {isLoading ? (
                     <button
                     className={classNames(
                       'rounded border-b-4 hidden border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:border-blue-500 hover:bg-blue-400'
                     )}
                     value="Claim"
                     onClick={() => handleReward()}
                   >
                     Claim All
                   </button>
                  ) :(
                    <button
                    className={classNames(
                      'rounded border-b-4  border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:border-blue-500 hover:bg-blue-400'
                    )}
                    value="Claim"
                    onClick={() => handleReward()}
                  >
                    Claim All
                  </button>
                  )}
                 
                </th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit, index) => (
                <tr key={deposit.id} className="bg-slate-600">
                  <td className="whitespace-nowrap border text-center font-medium text-white dark:text-white">
                    {index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center text-white">
                    {deposit.createdAt}
                  </td>
                  <td className="border px-4 py-2 text-center text-white">
                    {deposit.email}
                  </td>
                  <td className="border px-4 py-2 text-center text-white">
                    {deposit.total / 49}
                  </td>
                  <td className="border px-4 py-2 text-center text-pink-500">
                    Earning...{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="border px-4 py-2 text-center uppercase text-white">
        <p>Earn History</p>
      </div>
      <table className="w-full text-center text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="">
              No.
            </th>
            <th scope="col" className="p-2">
              Time
            </th>
            <th scope="col" className="p-2">
              Referral
            </th>
            <th scope="col" className="p-2">
              Earn
            </th>
            <th scope="col" className="p-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data, index) => (
            <tr key={data.id} className="bg-slate-600">
              <td className="whitespace-nowrap font-medium text-white dark:text-white">
                {index + 1}
              </td>
              <td className="p-2 text-white">{data.createdAt}</td>
              <td className="p-2 text-white">{data.email}</td>
              <td className=" text-white">{data.total / 49}</td>
              <td className=" text-green-500">Success</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Rewards
