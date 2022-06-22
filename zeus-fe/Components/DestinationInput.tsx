import React from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
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
        placeholder="Station or address"
      />
      <TouchableOpacity style={styles.iconWrapper} onPress={props.handleSubmit}>
        <SearchIcon />
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: '#fff',
    padding: 10,
    width: 240,
    height: 41,
    position: 'relative',
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
  },
})
