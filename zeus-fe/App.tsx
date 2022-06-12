import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Alert, Pressable} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { avoids, stations, metroExits, travelModes } from './Utils/MetroData'
import MapViewDirections from 'react-native-maps-directions'
import { StationPicker } from './Components/StationPicker'
import { DestinationInput } from './Components/DestinationInput'
// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'
import { initialRegion } from './Constants'

export default function App() {
  useFonts({ Poppins_700Bold })
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [avoid] = useState(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExit, setPreferredExit] = useState('')
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 })
  const [startLocation, setStartLocation] = useState({ latitude: 0, longitude: 0 })
  const [directions, setDirections] = useState('')
  const [ stationsList, setStationsList ] = useState(stations)
  const [ metroExitsList, setMetroExitisList ] = useState(metroExits)
  const [ selectedStation, setSelectedStation ] = useState<string>('')
  const [ exitsForSelectedStation, setExitsForSelectedStation ] = useState<MetroExit[]>()
  //const [ urls, setUrls ] = useState<any[]>()
  const [error, setError] = useState('')

  useEffect(() => {
    //console.log(`stations is: ${JSON.stringify(stationsList)}`)
    console.log(`selectedStation is: ${selectedStation}`)
    console.log(`exitsForSelectedStation is: ${JSON.stringify(exitsForSelectedStation)}`)
  },[selectedStation])

  useEffect(() => {
    //console.log(`directions: is: ${JSON.stringify(directions)}`)
  },[directions])

  const handleSelectedStation = (pickedStation: string) => {
    //console.log(`pickedStation is: ${pickedStation}`)
    setSelectedStation(pickedStation)
    let tmp: Station = stationsList.filter( (it) => it.name.toLowerCase() === pickedStation.toLocaleLowerCase())[0]
    //console.log(`tmp is: ${JSON.stringify(tmp)}`)
    let stationExitsList = metroExitsList.filter( (it) => it.stationId === tmp.id )
    //console.log(`stationExitsList is: ${JSON.stringify(stationExitsList)}`)
    setExitsForSelectedStation(stationExitsList)

  }

  const handleSubmit = async () => {
    let urls: string[] = []
    exitsForSelectedStation?.forEach( (it) => {
      urls = [...urls, `${GOOGLE_API_BASE_URL}origin=${it.latitude},${it.longitude}&destination=${selectedDestination}&mode=${travelModes[1].name}&avoid=${avoid}&key=${GOOGLE_API_KEY}`]
    })
    console.log(`urls is: ${urls}`)
    
    try {
      const response = await Promise.all(
        urls.map(async (url) => {
          const resp = await fetch(url)
          return resp.json()
        }),
      )
      console.log(`response: is: ${JSON.stringify(response)}`)
      if (response[0].status === 'NOT_FOUND') return setError('Address not found! Please input a valid address.')

      let tempValue = 13600000
      for (let i = 0; i < response.length; i++) {
        const legs = response[i].routes[0].legs[0]
        if (legs.distance.value <= tempValue) {
          tempValue = legs.distance.value
          setPreferredExit(legs.start_address)
          setDirections(legs.steps)
          setStartLocation({
            latitude: legs.start_location.lat,
            longitude: legs.start_location.lng,
          })
          setDestination({
            latitude: legs.end_location.lat,
            longitude: legs.end_location.lng,
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDirectionBox = () => {
    // Todo: Show the direction box with directions after we have done the calculations from google API
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Metro Exits</Text>
      
      <StationPicker selectedStation= {selectedStation} 
      stationsList= {stationsList} 
      handleSelectedStation={handleSelectedStation}
      />

      <DestinationInput selectedDestination={selectedDestination}
      setSelectedDestination= {setSelectedDestination}
      handleSubmit={handleSubmit}
      />

      <MapView style={styles.map} initialRegion={initialRegion}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {
        preferredExit ? 
        <>
          <View>
            <Text style={{marginTop: 6, height: 30}}>Take the exit: {preferredExit}</Text>
          </View>
        </>
        : <></>
      }
      <StatusBar style="auto" />
    </View>
  )
}

// Todo: Add correct CSS from figma
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  map: {
    width: '100%',
    height: '75%',
  },
  titleText: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 0,
  },
  finderText: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 40,
    marginTop: 0,
    paddingTop: 0
  },
})
