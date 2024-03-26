import classNames from 'classnames'
import { formatPoints } from 'utils/currencyFormat'

interface HistoryItemProps {
  id: string
  createdAt: string
  ballValue: number
  total: number
}

export function HistoryItem({ createdAt, ballValue, total }: HistoryItemProps) {
  return (
    <div
      className={classNames(
        'group relative flex items-center justify-between gap-4 rounded-md p-1 px-2 hover:bg-secondary/80'
      )}
    >
      <div
        className={classNames(
          'flex max-w-full items-center justify-between gap-4'
        )}
      >
        <span className=" max-w-[30ch] truncate text-left sm:w-[25ch] md:w-[25ch] lg:w-[30ch] lg:max-w-[30ch]">
          {createdAt}
        </span>
        <span className="animate-pulse text-center text-text lg:w-[10ch]">
          {String(formatPoints(ballValue))}
        </span>
        <strong
          className={classNames(
            'animate-pulse text-center text-sm transition-colors sm:w-[15ch] md:w-[15ch] lg:w-[15ch]  lg:max-w-[15ch] lg:text-lg',
            {
              'text-green-600': total > ballValue,
              'text-gray-100': total == ballValue,
              'text-red-400': total < ballValue
            }
          )}
          title={'You Win ' + String(total)}
        >
          {String(formatPoints(total))}
        </strong>
      </div>
    </div>
  )
}
