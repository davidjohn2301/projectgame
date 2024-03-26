import React, { useState } from 'react'
import qrcode from '@images/qrcode.png'
import { firestore } from 'lib/firebase'
import { toast } from 'react-hot-toast'
import { useAuthStore } from 'store/auth'
import { useNavigate } from 'react-router-dom'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

const initialState = {
  userId: '',
  createdAt: '',
  amount: 0,
  txhash: '',
  status: ''
}

function FormDeposite() {
  const [state, setState] = useState(initialState)
  const user = useAuthStore(state => state.user)
  const id = useAuthStore(state => state.user.id)
  const availability = useAuthStore(state => state.setUserAvailiableWithdraw)
  const { userId, amount, txhash } = state
  const navigate = useNavigate()

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!amount || !txhash) {
      toast.error('Please enter value')
    } else {
      try {
        const deposite = addDoc(collection(firestore, 'deposite'), {
          userId: id,
          createdAt: Timestamp.now().toDate().toString(),
          amount: amount,
          txhash: txhash,
          status: 'Pending...'
        })
        availability(user)
        toast.success('Deposite successfully')
        setTimeout(() => navigate('/plinko'), 500)
      } catch (error) {}
      toast.success('Deposite successfully')
      setTimeout(() => navigate('/plinko'), 500)
    }
  }
  const handleCancel = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setTimeout(() => navigate('/contribute'), 500)
  }

  return (
    <div className="items-center justify-center ">
      <div className="mb-200 flex h-fit w-screen items-center justify-center">
        <div className="max-h-screen overflow-y-auto rounded shadow-lg">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-center rounded-t border-b p-4 md:p-5 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Deposite BEP-20 USDT
              </h3>
            </div>
            <div className="flex items-center justify-center">
              <div className="items-center justify-between">
                <img src={qrcode} alt="" />
              </div>
            </div>
            <div className="flex items-center justify-center rounded-t border-b dark:border-gray-600">
              <div className="items-center justify-between">
                <h5 className="font-semibold text-gray-900 dark:text-white">
                  0xE1F479e9E6909790073afcc4bB229e7129046E6f
                </h5>
              </div>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
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
                    Transaction Details: Example:
                    <a href="https://bscscan.com/tx/0x9ba9be436605b770b6d3b7ea575dfd799c4e16a5b9ead112fdba4f874e5c030a">
                      {' '}
                      https://bscscan.com/tx/0x9ba9be436605b.....fdba4f874e5c030a
                    </a>
                  </label>
                  <input
                    type="text"
                    name="txhash"
                    id="txhash"
                    value={txhash}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="https://bscscan.com/tx/0x9ba9be436605b770b6d3b7ea575dfd799c4e16a5b9ead112fdba4f874e5c030a"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-green-800 px-5 py-2.5 text-center text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Deposite
                </button>
                <button
                  onClick={handleCancel}
                  className="mt-4 justify-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
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
export default FormDeposite
