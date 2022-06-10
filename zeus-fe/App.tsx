import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { avoids } from './Utils/MetroData'
import MapViewDirections from 'react-native-maps-directions'
// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'
import { initialRegion } from './Constants'

export default function App() {
  useFonts({ Poppins_700Bold })
  const [inputValue, setInputValue] = useState<string>('')
  const [avoid] = useState(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExit, setPreferredExit] = useState('')
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 })
  const [startLocation, setStartLocation] = useState({ latitude: 0, longitude: 0 })
  const [directions, setDirections] = useState('')
  const [error, setError] = useState('')

  const urls = [
    `${GOOGLE_API_BASE_URL}origin=59.336571,18.062832&destination=${inputValue}&mode=walking&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
    `${GOOGLE_API_BASE_URL}origin=59.33633,18.062457&destination=${inputValue}&mode=walking&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
    `${GOOGLE_API_BASE_URL}origin=59.335739,18.064088&destination=${inputValue}&mode=walking&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
    `${GOOGLE_API_BASE_URL}origin=59.335488,18.062961&destination=${inputValue}&mode=walking&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
  ]
  const handleSubmit = async () => {
    try {
      const response = await Promise.all(
        urls.map(async (url) => {
          const resp = await fetch(url)
          return resp.json()
        }),
      )
      if (response[0].status === 'NOT_FOUND') return setError('Address not found! Please input a valid address.')

      let tempValue = 13600000
      for (let i = 0; i < response.length; i++) {
        const legs = response[i].routes[0].legs[0]
        if (legs.distance.value <= tempValue) {
          tempValue = legs.distance.value
          setPreferredExit(legs.start_address)
          setDirections(legs.steps[0].html_instructions)
          setStartLocation({
            latitude: legs.steps[0].start_location.lat,
            longitude: legs.steps[0].start_location.lng,
          })
          setDestination({
            latitude: legs.steps[0].end_location.lat,
            longitude: legs.steps[0].end_location.lng,
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
      <Text style={styles.finderText}>FINDER</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={(value: any) => setInputValue(value)}
          placeholder="Adress"
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {preferredExit ? (
        <View>
          <Text>Take the exit: {preferredExit}</Text>
        </View>
      ) : null}
      <StatusBar style="auto" />
    </View>
  )
}

// Todo: Add correct CSS from figma
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    marginRight: '8px',
    border: '1px solid',
    width: '241px',
    height: '41px',
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
  },
  titleText: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 38,
  },
  finderText: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    fontSize: 48,
  },
})
