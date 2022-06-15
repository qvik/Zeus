import React from 'react'
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'

export const DestinationInput = (props: {
  selectedDestination: string
  setSelectedDestination: (value: string) => void
  handleSubmit: () => void
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={props.selectedDestination}
          onChangeText={(value: any) => props.setSelectedDestination(value)}
          placeholder="Address"
        />
        <Pressable style={styles.button} onPress={props.handleSubmit}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    border: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginTop: 13,
    marginRight: 8,
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
