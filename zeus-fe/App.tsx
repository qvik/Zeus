import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import MapView from 'react-native-maps'

export default function App() {
  const [inputValue, setInputValue] = useState('')

  return (
    <View style={styles.container}>
      <Text>Metro Exit Finder</Text>
      <View>
        <TextInput value={inputValue} placeholder="Adress" />
        <Button title="Submit" />
      </View>
      <MapView style={styles.map} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
})
