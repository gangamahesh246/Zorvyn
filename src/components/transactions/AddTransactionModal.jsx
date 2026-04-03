import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addTransaction, updateTransaction } from '../../store/slices/transactionsSlice'
import { categories } from '../../data/mockData'
import { X } from 'lucide-react'

export default function AddTransactionModal({ onClose, editData = null }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'food',
    type: 'expense',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        description: editData.description,
        amount: String(editData.amount),
        category: editData.category,
        type: editData.type,
      })
    }
  }, [editData])

  const validate = () => {
    const newErrors = {}
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) newErrors.amount = 'Valid amount is required'
    if (!form.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...form,
      amount: Number(form.amount),
    }

    if (editData) {
      dispatch(updateTransaction({ ...payload, id: editData.id }))
    } else {
      dispatch(addTransaction(payload))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-white dark:bg-surface-dark-card rounded-2xl shadow-xl w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Grocery shopping"
              className={`input-field ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className={`input-field ${errors.amount ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`input-field ${errors.date ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              {editData ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
