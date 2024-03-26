import React, { useState } from 'react'
import { firestore } from 'lib/firebase'
import { toast } from 'react-hot-toast'
import { useAuthStore } from 'store/auth'
import { useNavigate } from 'react-router-dom'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { formatDate } from 'utils/dateFormat'

const initialState = {
  userId: '',
  createdAt: '',
  amount: 0,
  address: '',
  status: ''
}

function Withdraw() {
  const [state, setState] = useState(initialState)
  const id = useAuthStore(state => state.user.id)
  const balance = useAuthStore(state => state.wallet.balance)
  const { amount, address } = state
  const user = useAuthStore()

  const availability = useAuthStore(state => state.user.availability)
  console.log(availability)
  const navigate = useNavigate()

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
    console.log(state)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!amount || !address) {
      toast.error('Please enter value')
    } else {
      try {
        if (balance > 0 && balance >= amount && availability === true) {
          const withdraw = addDoc(collection(firestore, 'withdraw'), {
            userId: id,
            createdAt: formatDate(Date.now()),
            amount: amount,
            address: address,
            status: 'Pending...'
          })
          user.decrementBalance(amount)
        }
        toast.success('Withdraw order successfully')
        setTimeout(() => navigate('/plinko'), 500)
      } catch (error) {
        toast.error(
          'Your account is not eligible for withdrawal. Please deposit to be able to withdraw your winning reward.'
        )
        console.log(amount, address)
        console.log(error)
      }
    }
  }

  const handleCancel = () => {
    setTimeout(() => navigate('/contribute'), 500)
  }
  return (
    <div className="items-center justify-center ">
      <div className="mb-200 flex h-fit  items-center justify-center">
        <div className="max-h-screen overflow-y-auto rounded shadow-lg">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div className="md:p-5 flex items-center justify-center rounded-t border-b p-4 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Withdraw BEP-20 USDT
              </h3>
            </div>
            <div className="flex items-center justify-center rounded-t border-b dark:border-gray-600">
              <div className="items-center justify-between">
                <h5 className="font-semibold text-gray-900 dark:text-white">
                  Remember using bsc chain.
                </h5>
              </div>
            </div>
            {/* <!-- Modal body --> */}
            <div className="md:p-5 p-4">
              <form
                className="space-y-4"
                action="submit"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Amount:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="1000"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    form="text"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Bep-20 Wallet:
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="0x9baksjd92la2v...."
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full rounded-lg font-bold text-green-500 outline hover:bg-green-800 hover:text-white focus:outline-1 "
                >
                  Withdraw
                </button>
                <button
                  onClick={handleCancel}
                  className="w-80% mt-4 justify-center rounded bg-gray-300 px-4 py-2 text-center font-bold text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Withdraw
