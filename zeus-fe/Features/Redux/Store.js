import { configureStore } from '@reduxjs/toolkit';
import loginSliceReducer from './LoginSlice';
import envSliceReducer from './EnvSlice'

export const store = configureStore({
  reducer: {
    login: loginSliceReducer,
    appEnv: envSliceReducer,
  },
});