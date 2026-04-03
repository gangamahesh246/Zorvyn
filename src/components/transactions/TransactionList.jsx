import { useSelector, useDispatch } from 'react-redux'
import { useMemo, useState } from 'react'
import { deleteTransaction } from '../../store/slices/transactionsSlice'
import { categories } from '../../data/mockData'
import { formatCurrency, formatDate, getCategoryName, getCategoryColor } from '../../utils/helpers'
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, MoreVertical } from 'lucide-react'

export default function TransactionList({ onEdit }) {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.items)
  const filters = useSelector((state) => state.filters)
  const role = useSelector((state) => state.role.current)
  const [openMenu, setOpenMenu] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const filtered = useMemo(() => {
    let result = [...transactions]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          getCategoryName(categories, t.category).toLowerCase().includes(q)
      )
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }

    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type)
    }

    if (filters.dateRange !== 'all') {
      const now = new Date()
      const days = { '7d': 7, '30d': 30, '90d': 90 }[filters.dateRange] || 0
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        result = result.filter((t) => new Date(t.date) >= cutoff)
      }
    }

    result.sort((a, b) => {
      let cmp = 0
      if (filters.sortBy === 'date') {
        cmp = new Date(a.date) - new Date(b.date)
      } else if (filters.sortBy === 'amount') {
        cmp = a.amount - b.amount
      } else if (filters.sortBy === 'description') {
        cmp = a.description.localeCompare(b.description)
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp
    })

    return result
  }, [transactions, filters])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  if (filtered.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg font-medium mb-1">No transactions found</p>
          <p className="text-sm">Try adjusting your filters or add a new transaction</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Transaction
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Category
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Date
              </th>
              <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Amount
              </th>
              {role === 'admin' && (
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t.description}
                      </p>
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(categories, t.category) }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getCategoryName(categories, t.category)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(t.date)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(t)}
                        className="btn-ghost p-2 text-gray-400 hover:text-primary-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteTransaction(t.id))}
                        className="btn-ghost p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {paginated.map((t) => (
          <div key={t.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-sm font-semibold ${
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              {role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                    className="btn-ghost p-1.5"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenu === t.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-[120px] animate-fade-in">
                      <button
                        onClick={() => { onEdit(t); setOpenMenu(null) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => { dispatch(deleteTransaction(t.id)); setOpenMenu(null) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
