
import React, { useState, useCallback } from 'react'
import { View, FlatList, LayoutAnimation, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Text } from './Themed'
import { DirectionData } from 'types/ObjectTypes'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
import { DirectionStep } from 'types/ObjectTypes'

export const DirectionsDrawer = (props: {title: string, data: DirectionData | undefined }) => {
  //console.log(`data in DirectionsDrawer is: ${JSON.stringify(props.data)}`)
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [])

  function handleClickLink() {
    let startLocation = props.data?.startLocation
    let endLocation =  props.data?.endLocation

    const urlString = `https://www.google.com/maps/dir/${startLocation}+stockholm/@${props.data?.startLocationCoords.lat},${props.data?.startLocationCoords.lng},15z/${endLocation}/@${props.data?.endLocationCoords.lat},${props.data?.endLocationCoords.lng},15z`
    //'https://www.google.com/maps/dir/Malmskillnadsgatan/@59.33454740000001,18.065731,15z/,Riddarholmen,/@59.33454740000001,18.065731,15z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x465f9d68bc94411b:0x4fa50d706c120441!2m2!1d18.0592204!2d59.340353!1m5!1m1!1s0x465f77e197edb25f:0xeb8ea51073e21688!2m2!1d18.0635304!2d59.324902!3e2'
    WebBrowser.openBrowserAsync(encodeURI(urlString))
    .catch(err => console.log(err))
  }


  return (
    <>
      <TouchableOpacity onPress={toggleOpen} style={styles.heading}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.plusMinus}>{isOpen ? '-' : '+'}</Text>
      </TouchableOpacity>
      
      <View style={[styles.directionsContainer, !isOpen ? styles.hidden : undefined]}>
        <View style={styles.flexDirectionColumn}>
          <Text style={styles.stationExitTitle}> To {props.data?.endLocation.split(',')[0]}</Text>

          <View style={styles.flexDirectionRow}> 
            <Text style={styles.stationExitStepTextGrey}> Take </Text>
            <MaterialCommunityIcons style={{marginLeft: 10}} name="escalator-up" color={'#4f4d4d'} size={23} />
            <Text style={styles.stationExitStepText}> "Station exit step 1" </Text>
          </View>

          <View style={styles.flexDirectionRow}> 
            <Text style={styles.stationExitStepTextGrey}> Then </Text>
            <MaterialCommunityIcons style={{marginLeft: 10}} name="stairs" color={'#4f4d4d'} size={23} />
            <Text style={styles.stationExitStepText}> {props.data?.preferredExit.split(',')[0]} </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={{flex: 1}}> 
          <ScrollView showsVerticalScrollIndicator={true} style={{marginBottom: 5, marginHorizontal: 18}} >
           
            <Text style={styles.directionStepsExitTitle}>Further walking directions</Text>
            <TouchableOpacity onPress={handleClickLink} style={styles.touchableOpacityLinkContainer}>
              <Text style={styles.linkText}>(Open on:</Text>
              <Text style={[styles.linkText, {color: 'blue'}]}> maps.google.com </Text>
              <Text style={styles.linkText}>)</Text>
            </TouchableOpacity>
  
            {
              props.data?.directionSteps?.map((step: DirectionStep, index: number) => {
                let replacedHtmlInstructions = step.html_instructions.replaceAll('<b>', '')
                replacedHtmlInstructions = replacedHtmlInstructions.replaceAll('</b>', '')
                replacedHtmlInstructions = replacedHtmlInstructions.replace(/\n/g, "")               
                //console.log(`replacedHtmlInstructions is: ${replacedHtmlInstructions}`)
                if (index === 0) {
                  return (
                    <View key={index} style={[styles.flexDirectionRow, {marginBottom: 4}]} >
                      <MaterialCommunityIcons name="arrow-up-thin" color={'#4f4d4d'} size={30} />  
                      <View style={[styles.flexDirectionColumn, {}]}>
                        <Text style={[styles.listItemTxt, {}]} >Step: {index +1} - Distance: {step.distance.text},</Text> 
                        <Text style={[styles.listItemTxt, {marginLeft: -4}]} > {replacedHtmlInstructions},</Text>
                      </View>                     
                    </View>
                  )
                }
                else
                return (
                  <View key={index} style={[styles.flexDirectionRow, {marginBottom: 4}]} >
                    {
                      index % 2 ?
                        <MaterialCommunityIcons name="arrow-right-thin" color={'#4f4d4d'} size={30} />
                      : 
                        <MaterialCommunityIcons name="arrow-left-thin" color={'#4f4d4d'} size={30} />
                    }
                    <View style={styles.flexDirectionColumn}>
                      <Text style={[styles.listItemTxt, {}]} >Step: {index +1} - Distance: {step.distance.text},</Text> 
                      <Text style={[styles.listItemTxt, {marginLeft: -4}]} > {replacedHtmlInstructions},</Text>
                    </View>                     
                  </View>
                )
              })
            }
          </ScrollView>
        </View>

        <View style={styles.separator} />
    
        <View style={[styles.flexDirectionColumn]}>
            <Text style={styles.arriveAtTitle}> Arrive at: </Text>
            <View style={[styles.flexDirectionRow, {marginHorizontal: 18, width: '95%', flexWrap: 'wrap',  marginBottom: 10}]}>
              <View style={{flexDirection: 'row'}}> 
                  <Entypo style={{}} name="address" color={'#4f4d4d'} size={23} />
                  <Text style={styles.arriveAtText}> {props.data?.endLocation} </Text>
              </View>
            </View>
            <View style={{ marginBottom: 10, marginHorizontal: 18}}> 
                  <Text style={styles.arriveAtDurationText}>in approximately: {props.data?.duration.text} </Text>
            </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: 'white',
    width: '100%'
  },  
  title: {
    fontFamily: 'poppins_extraLight',
  },
  directionsContainer: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    height: '75%',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'flex-start'
  },
  flexDirectionColumn: {
    flexDirection: 'column',  
    marginHorizontal: 10
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  stationExitTitle: {
    marginBottom: 12, 
    fontFamily: 'poppins_medium',
    fontSize: 15
  },
  stationExitStepTextGrey: {
    color: 'grey',
    fontFamily: 'poppins_extraLight'
  },
  stationExitStepText: {
    marginBottom: 15, 
    marginLeft: 10,
    fontFamily: 'poppins_extraLight'
  },
  directionStepsExitTitle: {
    marginTop: 10, 
    fontFamily: 'poppins_extraLight',
    opacity: 0.7, 
    marginBottom: 0,
    fontSize: 14, 
  },
  listItemTxt: {
    fontFamily: 'poppins_extraLight',
    marginBottom: 1,
    fontSize: 14,
    color: 'black', 
    opacity: 0.7, 
  },
  touchableOpacityLinkContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 0,
    paddingTop: 0,
  },
  linkText: {
    textAlign: 'center',
    fontFamily: 'poppins_extraLight',
    opacity: 0.7, 
    fontSize: 10
  },
  arriveAtTitle: {
    fontFamily: 'poppins_extraLight',
    opacity: 0.7, 
    marginBottom: 12,
    marginTop: 10,
    fontSize: 14,
    marginLeft: 5
  },
  arriveAtText: {
    fontFamily: 'poppins_extraLight',
    fontSize: 14,
  },
  arriveAtDurationText: {
    fontFamily: 'poppins-regular',
    marginLeft: 9,
  },
  hidden: {
    height: 0,
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1, 
    width: '95%',
    marginHorizontal: 10
  },
  plusMinus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 20,
    marginBottom: 1,
    fontFamily: 'poppins_700Bold'
  }
});
