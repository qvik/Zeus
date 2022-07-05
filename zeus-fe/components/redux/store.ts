import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem'
import thunk from 'redux-thunk'
import updateDirectionData from './DirectionsSlice'
import addLocation from './searchLocationsSlice'

const reducers = combineReducers({
  previousSearches: addLocation,
  selectCurrentDirectionData: updateDirectionData,
})

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  whitelist: ['previousSearches'],
}
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export const persistor = persistStore(store)
