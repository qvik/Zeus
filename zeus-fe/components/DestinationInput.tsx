import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Foundation from 'react-native-vector-icons/Foundation'

export const DestinationInput = (props: {
  selectedDestination: string | undefined
  setSelectedDestination: (arg0: any) => void
  handleSubmit: ((event: GestureResponderEvent) => void) | null | undefined
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={props.selectedDestination}
        onChangeText={(value: any) => props.setSelectedDestination(value)}
        placeholder="Input destination"
      />
      <Pressable style={styles.button} onPress={props.handleSubmit}>
        <Foundation name="magnifying-glass" style={{marginLeft: 2, marginRight: 4, color: 'black'}} size={18}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginTop: 13,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginTop: 1,
    marginRight: 0,
    width: '65%',
    height: 33,
  },
  button: {
    height: 33,
    width: 25,
    marginTop: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 12,
    color: 'white',
  },
})
