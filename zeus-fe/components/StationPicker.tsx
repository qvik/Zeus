/* eslint-disable no-undef */
import React, { useRef } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Station } from 'types/ObjectTypes'

export const StationPicker = (props: {
  selectedStation: string | undefined
  handleSelectedStation: (arg0: any) => void
  stationsList: Station[]
}) => {
  const dropdownRef = useRef({})

  return (
    <View style={styles.viewContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <SelectDropdown
          data={props.stationsList} //the dataObject to iterate
          //defaultValueByIndex={1}
          // defaultValue={'pick a station'}
          onSelect={(selectedItem, index) => {
            // console.log(`selectedItem is: ${selectedItem}`)
            // console.log(`selectedItem.name is: ${selectedItem.name}`)
            props.handleSelectedStation(selectedItem.name)
            dropdownRef.current
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            //text in the dropdown after selection
            return selectedItem.name
          }}
          rowTextForSelection={(item, index) => {
            //value in the object to show as the select text
            return item.name
          }}
          buttonStyle={styles.dropdownBtnStyle} //weird but need it here....
          dropdownIconPosition={'right'} //position of the icon arrow
          renderCustomizedButtonChild={(selectedItem, index) => {
            //styled dropdown with left icon earth, and right icon arrow
            return (
              <View style={styles.dropdownBtnChildStyle}>
                {selectedItem ? (
                  //<Image source={selectedItem.image} style={styles.dropdown3BtnImage} />
                  <FontAwesome name="train" color={'#4f4d4d'} size={16} />
                ) : (
                  <FontAwesome name="question-circle-o" color={'#4f4d4d'} size={22} />
                )}
                <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem.name : 'Select Station'}</Text>
                <FontAwesome name="chevron-down" color={'#4f4d4d'} size={16} />
              </View>
            )
          }}
          renderCustomizedRowChild={(item, index) => {
            //styled dropdown child rows
            return (
              <View style={styles.dropdownRowChildStyle}>
                {/*<Image source={item.image} style={styles.dropdownRowImage} /> */}
                <FontAwesome name="search" color={'#444'} size={30} />
                <Text style={styles.dropdownRowTxt}>{item.name}</Text>
              </View>
            )
          }}
          search
          searchInputStyle={styles.dropdownsearchInputStyle}
          searchPlaceHolder={'Search here'} //text for the search textInput
          searchPlaceHolderColor={'darkgrey'}
          renderSearchInputLeftIcon={() => {
            //the search TextInput icon (magnifierglas)
            return <FontAwesome name={'search'} color={'#444'} size={18} />
          }}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    width: '70%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    height: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dropdownBtnStyle: {
    width: '100%',
    height: 33,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 0,
    paddingLeft: 0,
  },
  dropdownBtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropdownBtnTxt: {
    color: '#403e3e',
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 12,
  },
  dropdownRowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 35, height: 35, resizeMode: 'cover' },
  dropdownRowTxt: {
    color: '#4f4d4d',
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 12,
  },
  dropdownsearchInputStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
})
