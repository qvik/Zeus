import React from 'react'
import { StyleSheet, Text, View, TextInput, Alert, Pressable } from 'react-native'

export const DestinationInput = (props: any) => {
  return (
    <>
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
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    marginBottom: 10,
    marginTop: 13,
    marginRight: '8px',
    width: '241px',
    height: '41px',
  },
  button: {
    marginBottom: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 12,
    color: 'blue',
    borderRightWidth: 3,
  },
})
