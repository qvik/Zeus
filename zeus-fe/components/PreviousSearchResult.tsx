import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../constants/Colors'

interface PreviousSearchResultProps {
  destination: string
}

const PreviousSearchResult = ({ destination }: PreviousSearchResultProps) => {
  return (
    <View style={styles.container}>
      <Text>{destination}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    backgroundColor: Colors.light.background,
    height: 50,
    width: '100%',
  },
})

export default PreviousSearchResult
