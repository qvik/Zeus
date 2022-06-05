import { createSlice}  from '@reduxjs/toolkit'

const envSlice = createSlice({
    name: 'appEnv',
    initialState: {},
    reducers: {
        updateEnv: (state, action) => {
            return action.payload
        }
    }
})


export const { updateEnv } = envSlice.actions;
export const selectCurrentAppEnv = (state) => state.appEnv; //store.appEnv

export default envSlice.reducer;