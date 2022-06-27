import { configureStore } from '@reduxjs/toolkit'
import directionsDataSliceReducer from './DirectionsSlice'

export const store = configureStore({
    reducer: {
        directionData: directionsDataSliceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch