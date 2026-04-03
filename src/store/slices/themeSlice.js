import { createSlice } from '@reduxjs/toolkit'

const loadTheme = () => {
  try {
    return localStorage.getItem('findash_theme') || 'light'
  } catch {
    return 'light'
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: loadTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('findash_theme', state.mode)
      } catch { /* silent fail */ }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      try {
        localStorage.setItem('findash_theme', state.mode)
      } catch { /* silent fail */ }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
