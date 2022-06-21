import { useAppSelector, useAppDispatch } from '../components/Redux/Hooks'
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, Image, View} from 'react-native'
import MapView from 'react-native-maps'
import { avoids, stations, metroExits, travelModes, initialRegion } from '../Utils/MetroData'
import { StationPicker } from '../components/StationPicker'
import { DestinationInput } from '../components/DestinationInput'
import { DirectionsDrawer } from '../components/DIrectionsDrawer'
import MapViewDirections from 'react-native-maps-directions'
import { updateDirections } from '../components/Redux/DirectionsSlice';


// @ts-ignore
import { GOOGLE_API_KEY, GOOGLE_API_BASE_URL } from '@env'
//import { initialRegion } from '../constants'

export const TabMetroExitsScreen = ({ navigation }: RootTabScreenProps<'TabMetroExits'>) => {
  const [ selectedDestination, setSelectedDestination ] = useState<string>('')
  const [ avoid ] = useState<string>(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [ preferredExit, setPreferredExit ] = useState<string>('')
  const [ destination, setDestination ] = useState({ latitude: 0, longitude: 0 })
  const [ startLocation, setStartLocation ] = useState({ latitude: 0, longitude: 0 })
  const [ directions, setDirections ] = useState<DirectionStep[]>()
  const [ stationsList, setStationsList ] = useState<Station[]>(stations)
  const [ metroExitsList, setMetroExitisList ] = useState<MetroExit[]>(metroExits)
  const [ selectedStation, setSelectedStation ] = useState<string>('Pick a station')
  const [ exitsForSelectedStation, setExitsForSelectedStation ] = useState<MetroExit[]>()
  const [ initialRegionObj, setInitialRegionObj ] = useState<InitialRegion>(initialRegion)
  
  const [error, setError] = useState('')

  const dispatch = useAppDispatch()
  //const dispatch = useDispatch()

  useEffect(() => {
    //console.log(`stations is: ${JSON.stringify(stationsList)}`)
    console.log(`selectedStation is: ${selectedStation}`)
    console.log(`exitsForSelectedStation is: ${JSON.stringify(exitsForSelectedStation)}`)
  },[selectedStation])

  useEffect(() => {
    console.log(`directions: is: ${JSON.stringify(directions)}`)
  },[directions])

  const handleSelectedStation = (pickedStation: string) => {
    //console.log(`pickedStation is: ${pickedStation}`)
    setSelectedStation(pickedStation)
    let tmp: Station = stationsList.filter( (it) => it.name.toLowerCase() === pickedStation.toLocaleLowerCase())[0]
    console.log(`tmp is: ${JSON.stringify(tmp)}`)
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
          dispatch(updateDirections(legs.steps))
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
    <>
    <View style={{flexDirection: 'row', marginBottom: 5}}>
      <View style={styles.imageContainer}>
        <Image source={require('./Images/logo.png')} style={styles.imageStyle} />  
      </View>

      <View style={{ width: '90%', marginTop: 3}}>
        <StationPicker selectedStation= {selectedStation} 
          stationsList= {stationsList} 
          handleSelectedStation={handleSelectedStation}
          />
        <View style={{ }}>
        <DestinationInput selectedDestination={selectedDestination}
          setSelectedDestination= {setSelectedDestination}
          handleSubmit={handleSubmit}
        />
        </View>
      </View>    
    </View>

    <SafeAreaView style={styles.container}>
      { /*<Text style={styles.titleText}>Metro Exits Finder</Text> */}
      <MapView style={styles.map} initialRegion={initialRegionObj}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {
        preferredExit ? 
        <>
          <DirectionsDrawer title="Directions: " items={directions} preferredExit={preferredExit}/>
        </>
        : <></>
      }
    </SafeAreaView>
    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  imageContainer: {
    marginLeft: 15,
    marginRight: 10,
    margintop: 50,
  },
  imageStyle: {width: 80, marginRight: 10, marginTop: 20, marginLeft: 0, height: 70, resizeMode: 'cover'},
  map: {
    width: '100%',
    flex:1,
    height: '80%' 
  },
  titleText: {
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 0,
    marginTop: 10,
  },
  finderText: {
    fontWeight: '700',
    fontSize: 30,
    marginTop: 20,
    paddingTop: 0
  },
  directionsScrollView: {
    height: 200, 
    borderWidth: 3,
    borderColor: 'black',
    position: 'absolute', 
  
    bottom:40, 
    backgroundColor: 'white', 
    width: '80%'
  },
  directionsText: {
    fontWeight: '700',
    marginBottom:20, 
    marginLeft: 20
  },
  atExitText: {
    marginBottom:20, 
    marginLeft: 30
  },
  bottomDividerListItem: {
    marginHorizontal: 10, 
    marginTop: 0, 
    marginBottom: 10, 
    paddingTop: 0
  }
})

  /*return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
}); */
