import { GOOGLE_API_BASE_URL, GOOGLE_API_KEY } from '@env'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { DestinationInput } from '../components/DestinationInput'
import { DirectionsDrawer } from '../components/DIrectionsDrawer'
import PreviousSearchResult from '../components/PreviousSearchResult'
import { updateDirectionData } from '../components/redux/DirectionsSlice'
import { useAppDispatch, useAppSelector } from '../components/redux/hooks'
import { addLocation, previousSearches } from '../components/redux/previousSearchesSlice'
import { StationPicker } from '../components/StationPicker'
import Logo from '../screens/images/logo.svg'
import { avoids, initialRegion, metroExits, stations, travelModes } from '../utils/MetroData'

export const TabMetroExitsScreen = () => {
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [hidePreviousDestinations, setHidePreviousDestinations] = useState<boolean>(false)
  const [avoid] = useState<string>(avoids[0].name + '|' + avoids[1].name + '|' + avoids[2].name)
  const [preferredExit, setPreferredExit] = useState<string>('')
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 })
  const [startLocation, setStartLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [directions, setDirections] = useState<DirectionStep[]>()
  const [selectedStation, setSelectedStation] = useState<string>('Pick a station')
  const [exitsForSelectedStation, setExitsForSelectedStation] = useState<MetroExit[]>()
  const [error, setError] = useState('')

  const searchHistory = useAppSelector(previousSearches)
  const dispatch = useAppDispatch()

  useEffect(() => {
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
    let urls: string[] = []
    exitsForSelectedStation?.forEach((it) => {
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
      // console.log(`response: is: ${JSON.stringify(response)}`)
      if (response[0].status === 'NOT_FOUND') return setError('Address not found! Please input a valid address.')
      dispatch(addLocation(selectedDestination))
      setHidePreviousDestinations(true)

      let tempValue = 13600000
      for (let i = 0; i < response.length; i++) {
        const legs = response[i].routes[0].legs[0]
        if (legs.distance.value <= tempValue) {
          tempValue = legs.distance.value
          setPreferredExit(legs.start_address)
          setDirections(legs.steps)
          //dispatch(updateDirections(legs.steps))
          dispatch(
            updateDirectionData({
              startLocation: legs.start_address,
              endLocation: legs.end_address,
              startLocationCoords: legs.start_location,
              endLocationCoords: legs.end_location,
              duration: legs.duration,
              directionSteps: legs.steps,
              preferredExit: legs.start_address,
            }),
          )

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
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Logo style={styles.imageStyle} />
        </View>
        <View style={{ width: '90%', marginTop: 3 }}>
          <StationPicker
            selectedStation={selectedStation}
            stationsList={stations}
            handleSelectedStation={handleSelectedStation}
          />
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
      <MapView style={styles.map} initialRegion={initialRegion}>
        <MapViewDirections mode="WALKING" origin={startLocation} destination={destination} apikey={GOOGLE_API_KEY} />
      </MapView>
      {preferredExit ? (
        <DirectionsDrawer title="Directions: " items={directions} preferredExit={preferredExit} />
      ) : (
        <></>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: 'hsla(0, 0%, 0%, 0.85)',
    paddingTop: '10%',
  },
  imageContainer: {
    marginLeft: 15,
    marginRight: 10,
    margintop: 50,
  },
  imageStyle: {
    width: 80,
    marginRight: 10,
    marginTop: 20,
    marginLeft: 0,
    height: 70,
    resizeMode: 'cover',
  },
})
