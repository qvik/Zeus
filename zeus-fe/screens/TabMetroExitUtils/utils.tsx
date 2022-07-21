import { GOOGLE_API_BASE_URL, GOOGLE_API_KEY } from '@env'
import { Coords, DirectionData } from '../../types/ObjectTypes'
import { travelModes, avoids } from '../../utils/MetroData'

const avoidString = avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name

export const getDestinationCoords = async (destination: string): Promise<Coords> => {
    console.log(`destination in getDestinationCoords is: ${destination}`)
  
    const url = `${GOOGLE_API_BASE_URL}origin=59.33544098561029,18.06375299406966&destination=${destination}&mode=${travelModes[1].name}&avoid=${avoidString}&key=${GOOGLE_API_KEY}`
    console.log(`url is: ${url}`)
    const response = await fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.status === 'OK') 
        return { latitude: responseJson.routes[0].legs[0].end_location.lat, longitude: responseJson.routes[0].legs[0].end_location.lng }
      else 
        return { latitude: 0, longitude: 0 }
    })
    .catch(error => {
      console.log(`getDestinationCoords error is: ${error}`)
      return { latitude: 0, longitude: 0 }
    })

    console.log(`getDestinationCoords response is: ${JSON.stringify(response)}`)
    console.log(``)
    console.log(``)
    return response
  }

  export const getDirectionSteps = async (startLocation: Coords, destination: Coords): Promise<DirectionData> => {
    

    const url = `${GOOGLE_API_BASE_URL}origin=${startLocation.latitude},${startLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelModes[1].name}&avoid=${avoidString}&key=${GOOGLE_API_KEY}`
    
    const response = await fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      //console.log(`getDirectionSteps response is: ${JSON.stringify(responseJson)}`)
      if (responseJson.status === 'OK') {
        const legs = responseJson.routes[0].legs[0];
        return {
          startLocation: legs.start_address,
          endLocation: legs.end_address,
          startLocationCoords: legs.start_location,
          endLocationCoords: legs.end_location,
          duration: legs.duration,
          directionSteps: legs.steps,
          preferredExit: legs.start_address,
        }
      }
      else 
        return {
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
    })
    .catch(error => {
      console.log(`getDestinationCoords error is: ${error}`)
      return {
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
    })

    console.log(`getDirectionSteps response is: ${JSON.stringify(response)}`)
    return response
  }  


  /*
Solution for when we have stations and exits in the database
Algorithm to find all Latitude Longitude locations within a certain distance from a given Lat Lng location
SET @orig_lat=-8.116137;
SET @orig_lon=-34.897488;
SET @dist=1000;

SELECT *,(((acos(sin((@orig_lat*pi()/180)) * sin((dest.latitude*pi()/180))+cos((@orig_lat*pi()/180))*cos((dest.latitude*pi()/180))*cos(((@orig_lon-dest.longitude)*pi()/180))))*180/pi())*60*1.1515*1609.344) as distance FROM nodes AS dest HAVING distance < @dist ORDER BY distance ASC LIMIT 100;
*/

//Meanwhile... Formulas here http://www.movable-type.co.uk/scripts/latlong.html
export const calculateDistanceAtoB = (latA: number, lngA: number, latB: number, lngB: number): number => {
  const R = 6371e3 // Radius of the earth in metres
  //const R = 6371; // Radius of the earth in km
  const φ1 = (latA * Math.PI) / 180 // φ, λ in radians
  const φ2 = (latB * Math.PI) / 180
  const Δφ = ((latB - latA) * Math.PI) / 180
  const Δλ = ((lngB - lngA) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres

  return d
}
