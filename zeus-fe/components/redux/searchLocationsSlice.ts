import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface SearchLocationsState {
  previousSearches: string[]
}

// Define the initial state using that type
const initialState: SearchLocationsState = {
  previousSearches: [],
}

export const searchLocationsSlice = createSlice({
  name: 'searchLocations',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<string>) => {
      ;[action.payload, ...state.previousSearches]
    },
  },
})

export const { addLocation } = searchLocationsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value

export default searchLocationsSlice.reducer
