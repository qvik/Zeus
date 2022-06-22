import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import SearchIcon from '../assets/search_icon.svg'

export const DestinationInput = (props: {
  selectedDestination: string
  setSelectedDestination: (value: string) => void
  handleSubmit: () => void
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={props.selectedDestination}
        onChangeText={(value: any) => props.setSelectedDestination(value)}
        placeholder="Address"
      />
      <SearchIcon />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    border: 1,
    backgroundColor: '#fff',
    padding: 10,
    width: 240,
    height: 41,
  },
  button: {
    height: 41,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18A0FB',
    borderRadius: 6,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 15,
    color: 'white',
  },
})
