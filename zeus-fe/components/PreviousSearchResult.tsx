import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../constants/Colors'
import MagnifyingGlass from '../screens/images/magnifying-glass-solid.svg'

interface PreviousSearchResultProps {
  destination: string
}

const PreviousSearchResult = ({ destination }: PreviousSearchResultProps) => {
  return (
    <View style={styles.container}>
      <Text>{destination}</Text>
      <MagnifyingGlass style={styles.searchIcon} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    backgroundColor: Colors.light.background,
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomColor: Colors.black.black30Percent,
    borderBottomWidth: 1,
  },
  searchIcon: {
    height: 20,
    width: 20,
    fill: Colors.black.black30Percent,
  },
})

export default PreviousSearchResult
