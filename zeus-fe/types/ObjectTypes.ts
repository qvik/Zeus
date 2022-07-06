export interface Station {
  id: number
  name: string
  imgSrc: string
}

export interface MetroExit {
  id: number
  name: string
  stationId: number
  latitude: string
  longitude: string
  imgSrc: any
}

export interface TravelMode {
  id: number
  name: string
}

export interface Avoid {
  id: number
  name: string
}

export interface InitialRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export interface DirectionData {
  startLocation: string
  endLocation: string
  startLocationCoords: Location1
  endLocationCoords: Location1
  duration: Duration
  directionSteps: DirectionStep[]
  preferredExit: string
}

export interface DirectionStep {
  distance: Distance
  duration: Duration
  start_location: Location1
  end_location: Location1
  html_instructions: string
  travel_mode: string
}

export interface Distance {
  text: string
  value: string
}

export interface Duration {
  text: string
  value: number
}

export interface Location1 {
  lat: number
  lng: number
}

/*let tmp: DirectionStep[] = [ {
    distance: {text: '', value: ''},
    duration: {text: '', value: ''},
    start_location: {lat: 0, lng: 0},
    end_location: {lat: 0, lng: 0},
    html_instructions: '',
    travel_mode: ''
}] */
