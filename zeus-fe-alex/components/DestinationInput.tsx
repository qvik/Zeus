import React from 'react';
import { Button, StyleSheet, TextInput, Text, View, Alert, Pressable, GestureResponderEvent} from 'react-native'
import { Picker } from '@react-native-picker/picker'
//import { Text } from '../components/Themed';
export const DestinationInput = (props: { selectedDestination: string | undefined; setSelectedDestination: (arg0: any) => void; handleSubmit: ((event: GestureResponderEvent) => void) | null | undefined; }) => {
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
      flexDirection: 'row',
      marginTop: 2,
    },
    input: {
      width: '52%',
      marginBottom:10,
      marginTop: 10,
      marginRight: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
    },
    button: {
      marginBottom:10, 
      marginTop: 10,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'grey',    
    },
    buttonText: {    
      fontWeight: '700',
      fontSize: 12,
      color: 'blue',
    },
  })