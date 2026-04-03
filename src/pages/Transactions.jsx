import { useState } from 'react'
import { useSelector } from 'react-redux'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionList from '../components/transactions/TransactionList'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import { exportToCSV, exportToJSON } from '../utils/helpers'
import { Plus, Download } from 'lucide-react'

export default function Transactions() {
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const role = useSelector((state) => state.role.current)
  const transactions = useSelector((state) => state.transactions.items)

  const handleEdit = (transaction) => {
    setEditData(transaction)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditData(null)
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {transactions.length} total transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-[140px] animate-fade-in">
                <button
                  onClick={() => { exportToCSV(transactions); setShowExport(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => { exportToJSON(transactions); setShowExport(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Add Transaction (Admin only) */}
          {role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      <TransactionFilters />
      <TransactionList onEdit={handleEdit} />

      {showModal && (
        <AddTransactionModal onClose={handleClose} editData={editData} />
      )}
    </div>
  )
}
