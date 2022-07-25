import { GOOGLE_API_BASE_URL, GOOGLE_API_KEY } from '@env'
import { SetStateAction, useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native'
import MapView, { Marker, MapEvent } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { DestinationInput } from "../components/DestinationInput"
import { DirectionsDrawer } from '../components/DirectionsDrawer'
import PreviousSearchResult from '../components/PreviousSearchResult'
import { updateDirectionData } from '../components/redux/DirectionsSlice'
import { useAppDispatch, useAppSelector } from '../components/redux/hooks'
import { addLocation, previousSearches } from '../components/redux/previousSearchesSlice'
import { StationPicker } from '../components/StationPicker'
import Logo from '../screens/images/logo.svg'
import { FontAwesome } from "@expo/vector-icons";
import { avoids, initialStationRegion, initialMetroExitRegion, metroExits, stations, travelModes, initialZoomInZoomOutDelta } from '../utils/MetroData'
import { InitialStationData, InitialMetroExitData, DirectionStep, MetroExit, Station, Coords, ZoomInZoomOutDelta, DirectionData } from '../types/ObjectTypes'
import { getClosestStationFromLocationX, getClosestStationExitFromDestinationX, getDestinationCoords, calculateDistanceAtoB, getDirectionSteps } from './TabMetroExitUtils/utils'
import { LocationObject } from "expo-location";
import * as Location from 'expo-location';

export const TabMetroExitsScreen = () => {

  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [hidePreviousDestinations, setHidePreviousDestinations] = useState<boolean>(false)
  const [avoid] = useState<string>(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [destinationCoords, setDestinationCoords] = useState<Coords>({ latitude: 59.3344901, longitude: 18.0626724 })
  const [startLocation, setStartLocation] = useState<Coords>({ latitude: 59.3344901,longitude: 18.0626724 })
  const [stationRegionObj, setStationRegionObj] = useState<InitialStationData>(initialStationRegion); //Also acting as initialRegion
  const [preferredMetroExitRegionObj, setPreferredMetroExitRegionObj] = useState<InitialMetroExitData>(initialMetroExitRegion)
  //only for keeping the zoom in zoom out levels in sync
  const [zoomDeltaObj, setZoomDeltaObj] = useState<ZoomInZoomOutDelta>(initialZoomInZoomOutDelta)
  const [directions, setDirections] = useState<DirectionData>()
  const [stationsList, setStationsList] = useState<Station[]>(stations);

  const [selectedStation, setSelectedStation] = useState<string>('Pick a station')
  const [exitsForSelectedStation, setExitsForSelectedStation] = useState<MetroExit[]>()
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const [location, setLocation] = useState<LocationObject>({ coords: { 
    latitude: 59.336571, longitude: 18.062832, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, 
    timestamp: 0, 
    mocked: false }); 

  const searchHistory = useAppSelector(previousSearches)
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    console.log(`useEffect previousSearches is: {${searchHistory}}`)
    if (!selectedDestination) {
      setHidePreviousDestinations(false)
    }
  }, [selectedDestination])

  useEffect(() => {
    console.log(`startLocation is: {${JSON.stringify(startLocation)}}`)
    console.log(`destination is: {${JSON.stringify(destinationCoords)}}`)
  }, [startLocation, destinationCoords])

  useEffect(() => {
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        alert('Permission to access location was denied')
        return;
      }
      
      await Location.getCurrentPositionAsync({})
      .then(location => {
        //setLocation(location)  //location is where device is. If use simulator then its a random place in the world so we mock it during dev.
        //Mocked location to be closer to stockholm somewhere (now sergelstorg)
        //this is so we can test this from anywhere instead of getting the device location
        setLocation({"coords":{"altitude":0,"altitudeAccuracy":-1,"latitude":59.3323126,"accuracy":5,"longitude":18.0632798,"heading":-1,"speed":-1},"timestamp":1656408123228.5981})
      })
      .catch(error => {
        console.log(`getCurrentPositionAsync error is: ${error}`)
      })
      //get device location's closest station
      const destinationCoords: Coords = {latitude: location.coords.latitude, longitude: location.coords.longitude}
      const closestStationToDevice: Station = await getClosestStationFromLocationX(location.coords.latitude, location.coords.longitude)
      console.log(`useEffect getDevicePosition: closestStationToDevice in useEffect is : ${JSON.stringify(closestStationToDevice)}`)
      
      const tmpMetroExitList: MetroExit[] = metroExits.filter((it) => it.stationId === closestStationToDevice.id)

      //get device location's closest station -> closest exit
      const closestStationExitToDevice: MetroExit = await getClosestStationExitFromDestinationX(destinationCoords.latitude, destinationCoords.longitude, tmpMetroExitList)
      console.log(`useEffect getDevicePosition: closest exit to device coords: ${JSON.stringify(destinationCoords)} 
      is: ${closestStationExitToDevice.name} with coords: ${closestStationExitToDevice.latitude}, ${closestStationExitToDevice.longitude}
      at station: ${closestStationToDevice.name} with coords: ${closestStationToDevice.latitude}, ${closestStationToDevice.longitude} 
      `)
  
      //get directions data for closest station's closest exit -> device position
      const directionsData = await getDirectionSteps({latitude: closestStationExitToDevice.latitude,
      longitude: closestStationExitToDevice.longitude}, {latitude: destinationCoords.latitude,longitude: destinationCoords.longitude})
      console.log(`useEffect getDevicePosition: directionsData in useEffect is : ${JSON.stringify(directionsData)}`)

    })()
  }, [])

  const handleSelectedStation = (pickedStation: string) => {
    setSelectedStation(pickedStation)
    const tmp: Station = stations.filter((it) => it.name.toLowerCase() === pickedStation.toLocaleLowerCase())[0]
    const stationExitsList = metroExits.filter((it) => it.stationId === tmp.id)
    setExitsForSelectedStation(stationExitsList)
  }

  const handleSubmit = async () => {
    setDrawerIsOpen(false)
    //Get coords for the destination
    const destinationCoords = await getDestinationCoords(selectedDestination)
    console.log(`handleSubmit destinationCoords is: ${JSON.stringify(destinationCoords)}`)
    setDestinationCoords(destinationCoords)

    //get closest station to destination
    const closestStationToDestination = await getClosestStationFromLocationX(destinationCoords.latitude, destinationCoords.longitude)
    console.log(`handleSubmit closest station to destination: ${selectedDestination}, with coords: ${JSON.stringify(destinationCoords)} is: ${closestStationToDestination.name} with coords: ${closestStationToDestination.latitude}, ${closestStationToDestination.longitude} `)
   
    //set StationRegion data which is for current closest station used by initial map view and station marker view
    //setStationRegionObj({ latitude: closestStationData.latitude, longitude: closestStationData.longitude, latitudeDelta: zoomDeltaObj.latitudeDelta, longitudeDelta: zoomDeltaObj.longitudeDelta, stationData: closestStationData })
    setStationRegionObj({ latitude: closestStationToDestination.latitude, longitude: closestStationToDestination.longitude, latitudeDelta: zoomDeltaObj.latitudeDelta, longitudeDelta: zoomDeltaObj.longitudeDelta, stationData: closestStationToDestination })
    
    //find all exits for the closest station to the destination
    const tmpMetroExitList: MetroExit[] = metroExits.filter((it) => it.stationId === closestStationToDestination.id)
  
    //get closet exit to destination
    const closestStationExitToDestination: MetroExit = await getClosestStationExitFromDestinationX(destinationCoords.latitude, destinationCoords.longitude, tmpMetroExitList)
    console.log(`closest exit to destination: ${selectedDestination}, with coords: ${JSON.stringify(destinationCoords)} 
    from station: ${closestStationToDestination.name} with coords: ${closestStationToDestination.latitude}, ${closestStationToDestination.longitude} 
    is: ${closestStationExitToDestination.name} with coords: ${closestStationExitToDestination.latitude}, ${closestStationExitToDestination.longitude}`)

    //set setPreferredMetroExitRegionObj data which is for current closest exit for map view and preferred exit marker view
    setPreferredMetroExitRegionObj({ latitude: closestStationExitToDestination.latitude, longitude: closestStationExitToDestination.longitude, latitudeDelta: zoomDeltaObj.latitudeDelta, longitudeDelta: zoomDeltaObj.longitudeDelta, metroExitData: closestStationExitToDestination })
    
    //We will color the marker for closest station black and closest exit red and the rest golden, so we need 3 region objects
    //We need to remove the closest exit from the list of exits for the closest station
    setExitsForSelectedStation(tmpMetroExitList.filter((it) => it.id !== closestStationExitToDestination.id))

    //set below for the MapViewDirections
    setStartLocation({...startLocation, latitude: closestStationExitToDestination.latitude,longitude: closestStationExitToDestination.longitude})
    setDestinationCoords({...destinationCoords, latitude: destinationCoords.latitude,longitude: destinationCoords.longitude})

    //get directions data for closest station -> closest exit to destination
    const directionsData = await getDirectionSteps({latitude: closestStationExitToDestination.latitude,
      longitude: closestStationExitToDestination.longitude}, {latitude: destinationCoords.latitude,longitude: destinationCoords.longitude})
    //console.log(`handleSubmit directionStepsData is: ${JSON.stringify(directionsData)}`)
    
    dispatch(updateDirectionData(directionsData)) //used in modal but not used now.
    setDirections(directionsData) //used in drawer to display directions
    setDrawerIsOpen(true)

    //save search to history
    dispatch(addLocation(selectedDestination))
    setHidePreviousDestinations(true)
  }
  const mapZoomIn = () => {
    console.log(`mapZoomIn`)
    setZoomDeltaObj({ ...zoomDeltaObj, latitudeDelta: zoomDeltaObj.latitudeDelta / 1.5, longitudeDelta: zoomDeltaObj.longitudeDelta / 1.5 })
    setStationRegionObj({ ...stationRegionObj, latitudeDelta: stationRegionObj.latitudeDelta / 1.5, longitudeDelta: stationRegionObj.longitudeDelta / 1.5 })
  }

  const mapZoomOut = () => {
    console.log(`mapZoomOut`)
    setZoomDeltaObj( { ...zoomDeltaObj, latitudeDelta: zoomDeltaObj.latitudeDelta * 1.5, longitudeDelta: zoomDeltaObj.longitudeDelta * 1.5 })
    setStationRegionObj({ ...stationRegionObj, latitudeDelta: stationRegionObj.latitudeDelta * 1.5, longitudeDelta: stationRegionObj.longitudeDelta * 1.5 })
  }

  const getClickedCoords = (event: MapEvent<{}>) => { 
    console.log(`getClickedCoords: event is: ${JSON.stringify(event.nativeEvent.coordinate)}`);
    //setRegionObj( { latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude,  latitudeDelta: regionObj.latitudeDelta, longitudeDelta:regionObj.longitudeDelta})
  }  
  return (
    <>
      <View style={styles.header}>
        <Logo style={styles.imageStyle} />
        <View style={{ width: '93%', marginTop: 3 }}>
          { /*<StationPicker
            selectedStation={selectedStation}
            stationsList={stations}
            handleSelectedStation={handleSelectedStation}
          /> */}
          <View style={{}}>
            <DestinationInput
              selectedDestination={selectedDestination}
              setSelectedDestination={setSelectedDestination}
              handleSubmit={handleSubmit}
            />
          </View>
        </View>
      </View>
      {searchHistory.map((item) => {
        if (selectedDestination && item.includes(selectedDestination) && !hidePreviousDestinations) {
          return (
            <PreviousSearchResult
              key={item}
              destination={item}
              onPress={() => {
                setSelectedDestination(item)
                setHidePreviousDestinations(true)
              }}
            />
          )
        }
      })}

      <SafeAreaView style={styles.mapContainer}>
        <MapView style={styles.map} 
          initialRegion={stationRegionObj} 
          region={stationRegionObj}
          onRegionChange={(region) => {
            //console.log(`onRegionChange: ${JSON.stringify(region)}`);
          }}
          onPress={(event) => getClickedCoords(event)}  //get coords from where clicked
        >
          <MapViewDirections
            mode="WALKING"
            origin={startLocation}
            destination={destinationCoords}
            apikey={GOOGLE_API_KEY}
            //lineDashPattern={[2, 0, 2]}  <-- patterned line
            lineDashPattern={[0]}  //<-- solidline
            strokeWidth={1} 
            strokeColor={'black'}
            resetOnChange={false}
          />
          {
            stationRegionObj && 
              <Marker key={100} coordinate={stationRegionObj}
                title={stationRegionObj.stationData.name + ' T-Bana'}
                description={stationRegionObj.latitude + ', ' + stationRegionObj.longitude}
                draggable={true}
                pinColor={'black'}
                onDragEnd={(event) => {
                  //console.log(`onDragEnd: ${JSON.stringify(event.nativeEvent.coordinate)}`);
                  //setRegionObj( { latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude,  latitudeDelta: regionObj.latitudeDelta, longitudeDelta:regionObj.longitudeDelta})
                } }
                onDragStart={(event) => {
                  //can be used together with onDragEnd to draw distance from start location to end
                  //console.log(`onDragStart: ${JSON.stringify(event.nativeEvent.coordinate)}`);
                  }
                }
              />
          }
          {
            exitsForSelectedStation && (
              exitsForSelectedStation.map((exit, index) => {
                  return (
                    <Marker key={exit.id} coordinate={exit} 
                    title={'Exit: ' + index + ' ' + exit.name}
                    description={exit.latitude + ', ' + exit.longitude}                   
                    pinColor={'gold'}
                  />
                  )
                }
              )
            )
          }
          {
            preferredMetroExitRegionObj && 
              <Marker key={200} coordinate={preferredMetroExitRegionObj}
                title={preferredMetroExitRegionObj.metroExitData.name + ' T-Bana'}
                description={preferredMetroExitRegionObj.latitude + ', ' + preferredMetroExitRegionObj.longitude}
                draggable={true}
                pinColor={'red'}
                onDragEnd={(event) => {
                  //console.log(`onDragEnd: ${JSON.stringify(event.nativeEvent.coordinate)}`);
                  //setRegionObj( { latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude,  latitudeDelta: regionObj.latitudeDelta, longitudeDelta:regionObj.longitudeDelta})
                } }
                onDragStart={(event) => {
                  //can be used together with onDragEnd to draw distance from start location to end
                  //console.log(`onDragStart: ${JSON.stringify(event.nativeEvent.coordinate)}`);
                  }
                }
              />
          }   
        </MapView>

        {
          drawerIsOpen ? (<DirectionsDrawer title="Directions: " data={directions} />) 
          : <></>
        }
      </SafeAreaView>
      <View style={{opacity: 0.5, backgroundColor: 'grey', flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: '90%', marginTop: 530, position: 'absolute'}}>
        <Pressable onPress={() => mapZoomIn()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,

          })}>
          <FontAwesome name="plus" size={25} color='black' style={{ marginRight: 0}}
          />
        </Pressable>
      </View>
      <View style={{opacity: 0.5, backgroundColor: 'grey', flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: '90%', marginTop: 560, position: 'absolute'}}>
        <Pressable onPress={() => mapZoomOut()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,

          })}>
          <FontAwesome name="minus" size={25} color='black' style={{ marginRight: 0}}
          />
        </Pressable>
      </View>       
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: 'hsla(0, 0%, 0%, 0.85)',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
  },
  imageStyle: {
    width: 80,
    marginRight: 10,
    marginTop: 20,
    marginLeft: 15,
    height: 70,
    resizeMode: 'cover',
    marginBottom: 20,
  },
})
