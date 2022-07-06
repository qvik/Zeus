import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

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
        <Text style={styles.buttonText}> Submit </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginTop: 1,
    marginRight: 5,
    width: '54%',
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
  },
  button: {
    height: 33,
    width: 54,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 12,
    color: 'blue',
  },
})
