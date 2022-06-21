import { createSlice, PayloadAction}  from '@reduxjs/toolkit'
import type { RootState } from './Store'

const initialState: DirectionStep[] = [ 
    {
        distance: {text: '', value: ''}, 
        duration: {text: '', value: ''},
        start_location: {lat: 0, lng: 0},
        end_location: {lat: 0, lng: 0},
        html_instructions: '',
        travel_mode: '' 
    }
]
const directionsSlice = createSlice({
    name: 'directionsX',
    initialState
    /*initialState:[ 
        {
            distance: {text: '', value: ''}, 
            duration: {text: '', value: ''},
            start_location: {lat: 0, lng: 0},
            end_location: {lat: 0, lng: 0},
            html_instructions: '',
            travel_mode: '' 
        }]*/,
    reducers: {
        updateDirections: (state, action: PayloadAction<DirectionStep[]>) => {
            return action.payload
        }
    }
})

export const { updateDirections } = directionsSlice.actions;
export const selectCurrentDirections = (state: RootState) => state.directions;  //store.login

export default directionsSlice.reducer;