import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from './slices/transactionsSlice'
import filtersReducer from './slices/filtersSlice'
import roleReducer from './slices/roleSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    filters: filtersReducer,
    role: roleReducer,
    theme: themeReducer,
  },
})
