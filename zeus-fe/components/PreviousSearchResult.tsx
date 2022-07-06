import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../constants/Colors'
import MagnifyingGlass from '../screens/images/magnifying-glass-solid.svg'

interface PreviousSearchResultProps {
  destination: string
  onPress: ((event: GestureResponderEvent) => void) & (() => void)
}

const PreviousSearchResult = ({ destination, onPress }: PreviousSearchResultProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.textContainer}>
          <Text style={styles.searchResultText}>{destination}</Text>
          <MagnifyingGlass style={styles.searchIcon} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    backgroundColor: Colors.light.background,
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.black.black30Percent,
  },
  textContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  searchIcon: {
    height: 20,
    width: 20,
    fill: Colors.black.black50Percent,
  },
  searchResultText: {
    opacity: 0.6,
  },
})

export default PreviousSearchResult
