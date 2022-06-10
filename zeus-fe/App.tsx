import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import axios from 'axios'
import { travelModes, avoids } from './Utils/FejkData'

// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'

export default function App() {
  const [inputValue, setInputValue] = useState<string>('Kungsgatan 64')
  //default mode walking
  const [travelMode, setTravelMode] = useState(travelModes[1].name)
  //default avoid all tolls|highways|ferries
  const [avoid, setAvoid] = useState(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExitData, setPreferredExitData] = useState({})
  let [] = useFonts({
    Poppins_700Bold,
  })

  const initialRegion = {
    latitude: 59.336571,
    longitude: 18.062832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  const handleSubmit = async () => {
    try {
      // Todo: Do a map here and store the urls as array and add the remaining exits
      await Promise.all([
        axios.get(
          `${GOOGLE_API_BASE_URL}origin=59.336571,18.062832&destination=${inputValue}&mode=${travelMode}&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
        ),
        axios.get(
          `${GOOGLE_API_BASE_URL}origin=59.33633,18.062457&destination=${inputValue}&mode=${travelMode}&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
        ),
        axios.get(
          `${GOOGLE_API_BASE_URL}origin=59.335739,18.064088&destination=${inputValue}&mode=${travelMode}&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
        ),
        axios.get(
          `${GOOGLE_API_BASE_URL}origin=59.335488,18.062961&destination=${inputValue}&mode=${travelMode}&avoid=${avoid}&key=${GOOGLE_API_KEY}`,
        ),
      ])
        .then((response) => {
          let tempValue = 13600000
          for (let i = 0; i < response.length; i++) {
            const legs = response[i]?.data?.routes[0]?.legs[0]
            if (!legs) return console.log('Something wrong with setting distance variable.')
            if (legs.distance.value <= tempValue) {
              tempValue = legs.distance.value
              setPreferredExitData({
                preferredExit: legs.start_address,
                totDistance: legs.distance.value,
                totDuration: legs.duration.value,
                directions: legs.steps,
              })
              console.log(preferredExitData, 'test')
            }
          }
        })
        .catch((err) => console.log(err))
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
