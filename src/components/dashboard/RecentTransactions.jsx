import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatDate, getCategoryName } from '../../utils/helpers'
import { categories } from '../../data/mockData'

export default function RecentTransactions({ onViewAll }) {
  const transactions = useSelector((state) => state.transactions.items)

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [transactions])

  if (recent.length === 0) {
    return (
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-sm">No transactions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  t.type === 'income'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {t.type === 'income' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {t.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryName(categories, t.category)} &middot; {formatDate(t.date)}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold flex-shrink-0 ml-3 ${
                t.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
