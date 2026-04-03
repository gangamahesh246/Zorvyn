import { useSelector, useDispatch } from 'react-redux'
import {
  setSearch,
  setCategory,
  setType,
  setDateRange,
  setSortBy,
  setSortOrder,
  resetFilters,
} from '../../store/slices/filtersSlice'
import { categories } from '../../data/mockData'
import { Search, X, ArrowUpDown } from 'lucide-react'

export default function TransactionFilters() {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filters)

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all'

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="input-field pl-10"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) => dispatch(setType(e.target.value))}
            className="input-field w-auto min-w-[120px]"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => dispatch(setDateRange(e.target.value))}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="input-field w-auto min-w-[100px]"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="description">Name</option>
            </select>
            <button
              onClick={() => dispatch(setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'))}
              className="btn-ghost p-2.5"
              title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
