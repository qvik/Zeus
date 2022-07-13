import { GOOGLE_API_BASE_URL, GOOGLE_API_KEY } from '@env'
import { SetStateAction, useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
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
import { avoids, initialStationRegion, initialMetroExitRegion, metroExits, stations, travelModes, initialZoomInZoomOutDelta } from '../utils/MetroData'
import { InitialStationData, InitialMetroExitData, DirectionStep, MetroExit, Station, Coords, ZoomInZoomOutDelta, DirectionData } from '../types/ObjectTypes'
import { getDestinationCoords, calculateDistanceAtoB, getDirectionSteps } from './TabMetroExitUtils/utils'

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

  const searchHistory = useAppSelector(previousSearches)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log(`useEffect previousSearches is: {${searchHistory}}`)
    if (!selectedDestination) {
      setHidePreviousDestinations(false)
    }
  }, [selectedDestination])

  const handleSelectedStation = (pickedStation: string) => {
    setSelectedStation(pickedStation)
    const tmp: Station = stations.filter((it) => it.name.toLowerCase() === pickedStation.toLocaleLowerCase())[0]
    const stationExitsList = metroExits.filter((it) => it.stationId === tmp.id)
    setExitsForSelectedStation(stationExitsList)
  }

  const handleSubmit = async () => {
    setDrawerIsOpen(false)
    const destinationCoords = await getDestinationCoords(selectedDestination)
    console.log(`handleSubmit destinationCoords is: ${JSON.stringify(destinationCoords)}`)
    setDestinationCoords(destinationCoords)

    let tmpDistance: number = 13600000
    let resultDistance: number = 13600000
    let tmpStationId: number
    let closestStationData: Station
    let tmpMetroExitList: MetroExit[]

    //get closest station to destination
    stationsList.forEach((station, index) => {
        tmpDistance = calculateDistanceAtoB(station.latitude, station.longitude, destinationCoords.latitude, destinationCoords.longitude);
        console.log(`tmpDistance is : ${tmpDistance} meters for station: ${station.name}`)
        if (tmpDistance < resultDistance) {
          resultDistance = tmpDistance;
          //get station Id for the current closest station to destination
          tmpStationId = station.id
        }
    })
    closestStationData = stations.filter((it) => it.id === tmpStationId)[0]
    console.log(`closest station to destination: ${selectedDestination}, with coords: ${JSON.stringify(destinationCoords)} is: ${closestStationData.name} with coords: ${closestStationData.latitude}, ${closestStationData.longitude} and distance: ${resultDistance} meters`)
    //find all exits for current closest station
    tmpMetroExitList = metroExits.filter((it) => it.stationId === tmpStationId)
   
    //set StationRegion data which is for current closest station used by initial map view and station marker view
    setStationRegionObj({ latitude: closestStationData.latitude, longitude: closestStationData.longitude, latitudeDelta: zoomDeltaObj.latitudeDelta, longitudeDelta: zoomDeltaObj.longitudeDelta, stationData: closestStationData })
    
    //get closet exit to destination
    let exitTmpDistance: number = 13600000
    let exitResultDistance: number = 13600000
    let tmpExitId: number
    let closestExitData: MetroExit

    tmpMetroExitList.forEach((exit, index) => {
      exitTmpDistance = calculateDistanceAtoB(exit.latitude, exit.longitude, destinationCoords.latitude, destinationCoords.longitude);
      console.log(`exitTmpDistance is : ${exitTmpDistance} meters for Exit: ${exit.name} at station: ${closestStationData.name}`)
      if (exitTmpDistance < exitResultDistance) {
        exitResultDistance = exitTmpDistance
        //get exit Id for the current closest exit to destination
        tmpExitId = exit.id
      }
    })
    closestExitData = metroExits.filter((it) => it.id === tmpExitId)[0]
    console.log(`closest exit to destination: ${selectedDestination}, with coords: ${JSON.stringify(destinationCoords)} 
    from station: ${closestStationData.name} with coords: ${closestStationData.latitude}, ${closestStationData.longitude} 
    is: ${closestExitData.name} with coords: ${closestExitData.latitude}, ${closestExitData.longitude} with distance: ${exitResultDistance} meters`)
    //set setPreferredMetroExitRegionObj data which is for current closest exit for map view and preferred exit marker view
    setPreferredMetroExitRegionObj({ latitude: closestExitData.latitude, longitude: closestExitData.longitude, latitudeDelta: zoomDeltaObj.latitudeDelta, longitudeDelta: zoomDeltaObj.longitudeDelta, metroExitData: closestExitData })
    
    //We will color the marker for closest station black and closest exit red and the rest golden, so we need 3 region objects
    //We need to remove the closest exit from the list of exits for the closest station
    setExitsForSelectedStation(tmpMetroExitList.filter((it) => it.id !== closestExitData.id))

    //set below for the MapViewDirections
    setStartLocation({latitude: closestExitData.latitude,longitude: closestExitData.longitude})
    setDestinationCoords({latitude: destinationCoords.latitude,longitude: destinationCoords.longitude})

    //set the directions data
    const directionsData = await getDirectionSteps({latitude: closestExitData.latitude,
      longitude: closestExitData.longitude}, {latitude: destinationCoords.latitude,longitude: destinationCoords.longitude})
    console.log(`handleSubmit directionStepsData is: ${JSON.stringify(directionsData)}`)
    
    dispatch(updateDirectionData(directionsData)) //not used now.
    setDirections(directionsData) //used in drawer to display directions
    setDrawerIsOpen(true)

    //save search to history
    dispatch(addLocation(selectedDestination))
    setHidePreviousDestinations(true)

  }
  const mapZoomIn = () => {
    setZoomDeltaObj({ ...zoomDeltaObj, latitudeDelta: zoomDeltaObj.latitudeDelta / 1.5, longitudeDelta: zoomDeltaObj.longitudeDelta / 1.5 })
  }

  const mapZoomOut = () => {
    setZoomDeltaObj( { ...zoomDeltaObj, latitudeDelta: zoomDeltaObj.latitudeDelta * 1.5, longitudeDelta: zoomDeltaObj.longitudeDelta * 1.5 })
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
            lineDashPattern={[0]}
            strokeWidth={1} 
            strokeColor={'black'}
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
    marginLeft: 20,
    height: 70,
    resizeMode: 'cover',
    marginBottom: 20,
  },
})
