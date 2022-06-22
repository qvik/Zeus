import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useState } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { avoids, metroExits, travelModes, initialRegion } from './Constants'
import MapViewDirections from 'react-native-maps-directions'
import Header from './Components/Header'
// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'
import { DirectionsBox } from './Components/DirectionsBox'

export default function App() {
  useFonts({ Poppins_700Bold })
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [avoid] = useState(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExit, setPreferredExit] = useState('')
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 })
  const [startLocation, setStartLocation] = useState({ latitude: 0, longitude: 0 })
  const [directions, setDirections] = useState<any[]>()
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    let urls: string[] = []
    metroExits.forEach((it) => {
      urls = [
        ...urls,
        `${GOOGLE_API_BASE_URL}origin=${it.latitude},${it.longitude}&destination=${selectedDestination}&mode=${travelModes[1].name}&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
      ]
    })
    try {
      const response = await Promise.all(
        urls.map(async (url) => {
          const resp = await fetch(url)
          return resp.json()
        }),
      )
      console.log(`response: is: ${JSON.stringify(response[0])}`)
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

  return (
    <View style={styles.container}>
      <Header handleSubmit={handleSubmit} />
      <MapView style={styles.map} initialRegion={initialRegion}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {preferredExit ? (
        <>
          <DirectionsBox preferredExit={preferredExit} directions={directions} />
        </>
      ) : (
        <></>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

// Todo: Add correct CSS from figma
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  map: {
    width: '100%',
    height: '85%',
  },
})
