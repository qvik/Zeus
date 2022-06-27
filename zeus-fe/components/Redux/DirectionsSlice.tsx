import { createSlice, PayloadAction}  from '@reduxjs/toolkit'
import type { RootState } from './Store'


const initialState: DirectionData = {
    'startLocation': '',
    'endLocation': '',
    'startLocationCoords': {lat: 0, lng: 0},
    'endLocationCoords': {lat: 0, lng: 0},
    'duration': {text: '', value: 0},
    'directionSteps': [ 
        {
            'distance': {text: '', value: ''}, 
            'duration': {text: '', value: 0},
            'start_location': {lat: 0, lng: 0},
            'end_location': {lat: 0, lng: 0},
            'html_instructions': '',
            'travel_mode': '' 
        }
    ],
    'preferredExit': ''
}


/*const initialState: DirectionStep[] = [ 
    {
        distance: {text: '', value: ''}, 
        duration: {text: '', value: ''},
        start_location: {lat: 0, lng: 0},
        end_location: {lat: 0, lng: 0},
        html_instructions: '',
        travel_mode: '' 
    }
]*/
const directionsDataSlice = createSlice({
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
        //updateDirections: (state, action: PayloadAction<DirectionStep[]>) => {
        updateDirectionData: (state, action: PayloadAction<DirectionData>) => {
            return action.payload
        }
    }
})

export const { updateDirectionData } = directionsDataSlice.actions;
export const selectCurrentDirectionData = (state: RootState) => state.directionData;  //store.login

export default directionsDataSlice.reducer;