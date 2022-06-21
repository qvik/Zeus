import { configureStore } from '@reduxjs/toolkit'
import directionsSliceReducer from './DirectionsSlice'

export const store = configureStore({
    reducer: {
        directions: directionsSliceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch