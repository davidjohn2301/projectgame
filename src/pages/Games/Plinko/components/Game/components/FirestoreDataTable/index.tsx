import { get, ref } from 'firebase/database'
import { database } from 'lib/firebase'
import { firestore } from 'lib/firebase'
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore'
import { useAuthStore } from 'store/auth'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleDashed, BookOpen } from 'phosphor-react'
import { HistoryItem } from './components/HistoryItem'

interface History {
  id: string
  createdAt: string
  ballValue: number
  total: number
}

export function FirestoreDataTable() {
  const userId = useAuthStore(state => state.user.id)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [history, setHistory] = useState<History[]>([])

  useEffect(() => {
    const getHistoryData = async () => {
      setIsLoading(true)
      const idRef = collection(firestore, 'history/')
      const q = query(
        idRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const historyData: History[] = querySnapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as History)
      )
      const sortedData = historyData
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
      setHistory(sortedData)
      setIsLoading(false)
    }
    getHistoryData()
    return () => {
      setHistory([])
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 ">
      <div className="flex max-w-80 flex-col items-center justify-center gap-3 rounded bg-primary py-8 text-text">
        <div className="w-full items-center justify-center rounded bg-background text-center text-2xl">
          <strong className="items-center justify-center">
            TOP 10 BIG WIN
          </strong>
          <br />
        </div>
        <div className="flex w-full flex-col gap-2 lg:mx-auto">
          {isLoading ? (
            <div className="flex w-full flex-col items-center justify-center py-4">
              <CircleDashed className="animate-spin" size="40" weight="bold" />
              <span className="mt-1 text-sm font-bold">Loading scores...</span>
            </div>
          ) : (
            <div>
              {history.map(history => (
                <HistoryItem
                  key={history.id}
                  id={history.id}
                  createdAt={history.createdAt}
                  ballValue={history.ballValue}
                  total={history.total}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Link
        to="/results"
        className="mb-4 flex items-center justify-center gap-4 rounded-lg bg-purpleDark p-4 text-lg font-bold text-text shadow-md transition-colors hover:bg-purple"
      >
        <BookOpen weight="fill" size="20" />
        SHOW FULL HISTORIES
      </Link>
    </div>
  )
}
