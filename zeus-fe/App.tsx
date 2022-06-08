import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import axios from 'axios'
// @ts-ignore
import { GOOGLE_API_KEY } from '@env'

export default function App() {
  const [inputValue, setInputValue] = useState<string>('')
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  })

  const initialRegion = {
    latitude: 59.336571,
    longitude: 18.062832,
    // Todo: Fix  the correct values for the ones below here.
    // they are the ones that achieve the "zoomed" in view of google maps
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }
  // Todo: this function should do the api call to Google and do the calculation for the best direction
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`)
      console.log(response)
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
          onChange={(event: any) => setInputValue(event.target.value)}
          placeholder="Adress"
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <MapView style={styles.map} initialRegion={initialRegion} />
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
