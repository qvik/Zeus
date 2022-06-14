import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { avoids, metroExits, travelModes, initialRegion } from './Constants'
import MapViewDirections from 'react-native-maps-directions'
import { DestinationInput } from './Components/DestinationInput'
import { ListItem } from 'react-native-elements/dist/list/ListItem'
import HTMLView from 'react-native-htmlview'
// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'

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

  const handleDirectionBox = () => {
    // Todo: Show the direction box with directions after we have done the calculations from google API
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Metro Exits</Text>
      <DestinationInput
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        handleSubmit={handleSubmit}
      />
      <MapView style={styles.map} initialRegion={initialRegion}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {
        preferredExit ? 
        <>
          <ScrollView style={{height: 80, position: 'absolute', marginBottom: 10, bottom:50, backgroundColor: 'white', width: '80%'}}>
            {
              directions?.map((step, index) => {
                let replacedHtmlInstructions = step.html_instructions.replace('<b>', '')
                replacedHtmlInstructions = replacedHtmlInstructions.replace('</b>', '')
                return (
                  <>
                    <Text style={{marginBottom:1}} key={index}>Step: {index}: Distance: {step.distance.text},</Text>
                    <HTMLView key={index +1}
                      value={replacedHtmlInstructions}
                    />
                    <ListItem key={index +2} bottomDivider style={{marginTop: 0, marginBottom: 10, paddingTop: 0}}></ListItem>
                  </>
                )
              })
            }
          </ScrollView>

          <View >
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
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '82%',
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
    paddingTop: 0,
  },
})
