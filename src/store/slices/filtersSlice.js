import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    search: '',
    category: 'all',
    type: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setType: (state, action) => {
      state.type = action.payload
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    resetFilters: (state) => {
      state.search = ''
      state.category = 'all'
      state.type = 'all'
      state.dateRange = 'all'
      state.sortBy = 'date'
      state.sortOrder = 'desc'
    },
  },
})

export const { setSearch, setCategory, setType, setDateRange, setSortBy, setSortOrder, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
