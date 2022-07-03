import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import directionsDataSliceReducer from './DirectionsSlice'

export const store = configureStore({
  reducer: {
    directionData: directionsDataSliceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
