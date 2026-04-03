import { createSlice } from '@reduxjs/toolkit'
import { transactions as mockTransactions } from '../../data/mockData'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('findash_transactions')
    return data ? JSON.parse(data) : mockTransactions
  } catch {
    return mockTransactions
  }
}

const saveToStorage = (transactions) => {
  try {
    localStorage.setItem('findash_transactions', JSON.stringify(transactions))
  } catch { /* silent fail */ }
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: loadFromStorage(),
    nextId: 100,
  },
  reducers: {
    addTransaction: (state, action) => {
      const newTransaction = {
        ...action.payload,
        id: state.nextId,
      }
      state.items.unshift(newTransaction)
      state.nextId += 1
      saveToStorage(state.items)
    },
    updateTransaction: (state, action) => {
      const index = state.items.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
        saveToStorage(state.items)
      }
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload)
      saveToStorage(state.items)
    },
    resetTransactions: (state) => {
      state.items = mockTransactions
      saveToStorage(state.items)
    },
  },
})

export const { addTransaction, updateTransaction, deleteTransaction, resetTransactions } = transactionsSlice.actions
export default transactionsSlice.reducer
