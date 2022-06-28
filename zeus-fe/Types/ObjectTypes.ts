interface Station {
    id: number,
    name: string,
    imgSrc: string,    
}

interface MetroExit {
    id: number,
    name: string,
    stationId: number,
    latitude: number,
    longitude: number,
    imgSrc: any,
}

interface MetroExitDistance {
    id: number,
    name: string,
    stationId: number,
    latitude: number,
    longitude: number,
    imgSrc: any,
    distance: number,
}

interface TravelMode {
    id: number,
    name: string,
}

interface Avoid {
    id: number,
    name: string,
}

interface InitialRegion {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

interface DirectionData {
    'startLocation': string,
    'endLocation': string,
    'startLocationCoords': Location1,
    'endLocationCoords': Location1,
    'duration': Duration,
    'directionSteps': DirectionStep[],
    'preferredExit': string,
}

interface DirectionStep {
    'distance': Distance,
    'duration': Duration,
    'start_location': Location1,
    'end_location': Location1,
    'html_instructions': string,
    'travel_mode': string
}

interface Distance {
    'text': string,
    'value': string
}

interface Duration {
    'text': string,
    'value': number
}

interface Location1 {
    'lat': number,
    'lng': number
}

/*let tmp: DirectionStep[] = [ {
    distance: {text: '', value: ''}, 
    duration: {text: '', value: ''},
    start_location: {lat: 0, lng: 0},
    end_location: {lat: 0, lng: 0},
    html_instructions: '',
    travel_mode: ''
}] */
