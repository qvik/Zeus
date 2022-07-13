import { Station, MetroExit, InitialStationData, InitialMetroExitData, ZoomInZoomOutDelta } from "types/ObjectTypes"

export const initialStationRegion: InitialStationData = {
  latitude: 59.33544098561029,
  longitude: 18.06375299406966,
  latitudeDelta: 0.002962962962962963,
  longitudeDelta: 0.0019753086419753087,
  stationData: { id: 0, name: "", imgSrc: "", latitude: 0, longitude: 0 },
}
export const initialMetroExitRegion: InitialMetroExitData = {
  latitude: 59.3323126,
  longitude: 18.0632798,
  latitudeDelta: 0.002962962962962963,
  longitudeDelta: 0.0019753086419753087,
  metroExitData: { id: 0, name: "", stationId: 0, latitude: 0, longitude: 0, imgSrc: "" },
}

export const initialZoomInZoomOutDelta: ZoomInZoomOutDelta = {
  latitudeDelta: 0.002962962962962963,
  longitudeDelta: 0.0019753086419753087,
}

export const stations: Station[] = [
  {
    id: 0,
    name: 'Hötorget',
    latitude: 59.33544098561029,
    longitude: 18.06375299406966,
    imgSrc: '',
  },
  {
    id: 1,
    name: 'Rådmansgatan',
    latitude: 59.34117276197691,
    longitude: 18.05819934312254,
    imgSrc: '',
  },
]

export const metroExits: MetroExit[] = [
  {
    id: 0,
    name: 'Tunnelgatan 5A',
    stationId: 0,
    latitude: 59.336571,
    longitude: 18.062832,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 2,
    name: 'Olof palmes gata 7T',
    stationId: 0,
    latitude: 59.33633,
    longitude: 18.062457,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 3,
    name: 'Kungsgatan 36',
    stationId: 0,
    latitude: 59.335739,
    longitude: 18.064088,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 4,
    name: 'Kungsgatan 40',
    stationId: 0,
    latitude: 59.335488,
    longitude: 18.062961,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 5,
    name: 'Kungsgatan 39',
    stationId: 0,
    latitude: 59.335581,
    longitude: 18.064356,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 6,
    name: 'Kungsgatan 41',
    stationId: 0,
    latitude: 59.335307,
    longitude: 18.063143,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 7,
    name: 'Malmskillnadsgatan 27A',
    stationId: 0,
    latitude: 59.334536,
    longitude: 18.065482,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 8,
    name: 'Sveavägen 16',
    stationId: 0,
    latitude: 59.3344901,
    longitude: 18.0637372,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 9,
    name: 'Sveavägen 17A',
    stationId: 0,
    latitude: 59.3344291,
    longitude: 18.0592844,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 11,
    name: 'Sveavägen 98T',
    stationId: 1,
    latitude: 59.3423633,
    longitude: 18.0552446,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 12,
    name: 'Sveavägen 67B',
    stationId: 1,
    latitude: 59.342127,
    longitude: 18.056889,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 13,
    name: 'Sveavägen 55A',
    stationId: 1,
    latitude: 59.340568,
    longitude: 18.058552,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 14,
    name: 'Rådmansgatan södra',
    stationId: 1,
    latitude: 59.340311,
    longitude: 18.058199,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
  {
    id: 15,
    name: 'Sveavägen 80A',
    stationId: 1,
    latitude: 59.340365,
    longitude: 18.059163,
    imgSrc: ['http://img1', 'http://img2', 'http://img3'],
  },
]

export const travelModes = [
  {
    id: 0,
    name: 'driving',
  },
  {
    id: 1,
    name: 'walking',
  },
  {
    id: 2,
    name: 'bicycling',
  },
  {
    id: 3,
    name: 'transit',
  },
]

export const avoids = [
  {
    id: 0,
    name: 'tolls',
  },
  {
    id: 1,
    name: 'highways',
  },
  {
    id: 2,
    name: 'ferries',
  },
]