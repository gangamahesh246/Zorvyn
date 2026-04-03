import { createSlice } from '@reduxjs/toolkit'

const loadRole = () => {
  try {
    return localStorage.getItem('findash_role') || 'admin'
  } catch {
    return 'admin'
  }
}

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    current: loadRole(),
  },
  reducers: {
    setRole: (state, action) => {
      state.current = action.payload
      try {
        localStorage.setItem('findash_role', action.payload)
      } catch { /* silent fail */ }
    },
  },
})

export const { setRole } = roleSlice.actions
export default roleSlice.reducer
