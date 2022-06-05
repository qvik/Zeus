import { createSlice}  from '@reduxjs/toolkit'

const loginSlice = createSlice({
    name: 'loginXXX',
    initialState: {
        "username": "",
        "authToken": "",
        "authStatus": "false",
        "isAdmin": "false"
      }, 
    reducers: {
        updateLogin: (state, action) => {
            return action.payload
        }
    }
})

export const { updateLogin } = loginSlice.actions;
export const selectCurrentAuth = (state) => state.login;  //store.login

export default loginSlice.reducer;