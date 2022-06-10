import { StatusBar } from 'expo-status-bar'
import * as React from 'react';
import { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import axios from 'axios'
import { stations, metroExits, travelModes, avoids } from './Components/FejkData';

// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'

export default function App() {

  const [inputValue, setInputValue] = useState<string>('')
  const [stationsList, setStationsList] = useState(stations)
  const [exitsList, setExitsList] = useState(metroExits)
  //default mode walking
  const [travelMode, setTravelMode] = useState(travelModes[0].name)
  //default avoid all tolls|highways|ferries
  const [avoid, setAvoid] = useState( avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExitData, setPreferredExitData] = useState({})

  
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

  const handleSubmit2 = () => {
    let stationData: Station
    let stationExitsData: MetroExit[]
    stationData = stations.filter((it) => it.name.toLowerCase().includes(inputValue.toLowerCase()))[0]
    stationExitsData = metroExits.filter((it) => it.id === stationData.id)
    const numberOfStationExits: number = stationExitsData.length

    axios.all(stationExitsData.map((exit) => {
      axios.get( GOOGLE_API_BASE_URL 
      + 'origin=' + exit.latitude + ',' + exit.longitude 
      + '&destination=' + inputValue.toLowerCase() 
      + '&mode=' + travelMode
      + '&avoid=' + avoid
      + '&key=' + GOOGLE_API_KEY
      )
    }))
    .then ((res: any) => {
      console.log(`received google map directory data is:`, res)
      //max distance between 2 points on earth is 13500 km something...
      let tmpValue = 13600
      
      if (typeof res !== 'undefined' && res !== null) {
        for (const value of res) {
          let result = value.routes[0].legs[0].distance.value.split(' km')
          result = parseInt(result[0])
          if (result <= tmpValue) 
          {
            tmpValue = result
            setPreferredExitData({'preferredExit': value.routes[0].legs[0].start_address, 
                'totDistance': value.routes[0].legs[0].distance.value, 
                'totDuration': value.routes[0].legs[0].duration.value, 'directions': value.routes[0].legs[0].steps })
          }
        }
    }
    })
    .catch(function (error) {
      console.log(error);
    });    
  }

  const handleDirectionBox = () => {
    // Todo: Show the direction box with directions after we have done the calculations from google API
  }

  useEffect(() => {
    /*console.log(`GOOGLE_API_KEY is: ${GOOGLE_API_KEY}`)
    console.log(`GOOGLE_API_BASE_URL is: ${GOOGLE_API_BASE_URL}`)
    console.log(`stationsList is: ${JSON.stringify(stationsList)}`)
    console.log(`exitsList is: ${JSON.stringify(exitsList)}`)*/
  }, [])  

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
        <Button title="Submit" onPress={handleSubmit2} />
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
