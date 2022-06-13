import React from 'react';
import { Text, StyleSheet} from 'react-native'
import { Picker } from '@react-native-picker/picker'


export const StationPicker = (props) => {
  return (
    <> 
      <Text style={{marginBottom:1, paddingBottom: 0}}>Pick a station</Text> 
      <Picker
        selectedValue={props.selectedStation}
        style={styles.picker}
        itemStyle={{marginTop:0, marginBottom: 5, paddingTop: 0, paddingBottom: 5, 
          color: 'black', lineHeight: 14, fontSize: 15, height: 39}}
        mode="dropdown"
        placeholder="Pick station"
        onValueChange={(itemValue: any, itemIndex: any) => props.handleSelectedStation(itemValue)}>
        <Picker.Item key={10} label={props.selectedStation} value={props.selectedStation} />
        {
          props.stationsList.map(station => {
            return (
                <Picker.Item key={station.id} label={station.name} value={station.name} />
            )
          })
        }
      </Picker>
    </>
  )
}

const styles = StyleSheet.create({
    picker: {
      height: 20, 
      width: '60%',
      marginBottom: 10,
      marginTop: 0,
    },
 
  })