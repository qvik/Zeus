import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

const initialState: string[] = []

export const searchLocationsSlice = createSlice({
  name: 'previousSearches',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<string>) => {
      state.unshift(action.payload)
    },
  },
})

export const { addLocation } = searchLocationsSlice.actions

export const previousSearches = (state: RootState) => state.previousSearches

export default searchLocationsSlice.reducer
