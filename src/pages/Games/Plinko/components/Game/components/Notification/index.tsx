interface MultiplierHistoryProps {
  multiplierHistory: number[]
}

function MultiplierHistory({ multiplierHistory }: MultiplierHistoryProps) {
  return (
    <div className="absolute right-4 top-40 flex w-16 flex-col gap-1 overflow-hidden rounded-md bg-background md:top-60">
      {multiplierHistory.map((multiplier, index) => {
        if (multiplier > 3)
          return (
            <span
              key={`${multiplier}${index}${Math.random()}`}
              className="flex items-center justify-center bg-purpleDark p-1 font-bold text-text"
            >
              {multiplier}x
            </span>
          )
      })}
    </div>
  )
}
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [randomUser, setRandomUser] = useState(null)

  const fetchData = async () => {}
  const PromiseNotify = () => {
    const data = fetchData()
    toast.custom(t => (
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src="${data.image}"
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Emilia Gates</p>
            <p className="mt-1 text-sm text-gray-500">
              Sure! 8:30pm works great!
            </p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  )
}
export default Notification
//return sau
//B1: taoj const fetch data orimisr
//B2:  taoj querry duoc mutiplier >5x
