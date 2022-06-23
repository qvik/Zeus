import React, { useState, useCallback, useEffect, } from "react";
import { StyleSheet, LayoutAnimation, TouchableOpacity, ScrollView, StatusBar, Platform  } from 'react-native';
import { useAppSelector } from '../components/Redux/Hooks';
import { selectCurrentDirectionData } from '../components/Redux/DirectionsSlice';
import { Text, View } from '../components/Themed';
import HTMLView from 'react-native-htmlview'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function ModalScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [directionData, setDirectionData] = useState(useAppSelector(selectCurrentDirectionData))

  useEffect( () => {
    console.log(`directionData in modalScreen is: ${JSON.stringify(directionData)}`)
  }, [directionData])

  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <>
      <View style={{flex: 1}}>
      {/* stationExitContainer */ }
      <View style={styles.stationExitContainer}>
        <Text style={styles.stationExitText}> To {directionData.endLocation}</Text>

        <View style={styles.stationExitDirectionContainer}> 
          <Text style={styles.stationExitStepTextGrey}> Take </Text>
          <MaterialCommunityIcons style={{marginLeft: 10, marginTop: 7}} name="escalator-up" color={'#4f4d4d'} size={25} />
          <Text style={styles.stationExitStepText}> "Station exit step 1" </Text>
        </View>

        <View style={styles.stationExitDirectionContainer}> 
          <Text style={styles.stationExitStepTextGrey}> Then </Text>
          <MaterialCommunityIcons style={{marginLeft: 10, marginTop: 7}} name="stairs" color={'#4f4d4d'} size={25} />
          <Text style={styles.stationExitStepText}> "Station exit step 2" </Text>
        </View>

        <View style={styles.separator} lightColor="grey" darkColor="rgba(255,255,255,0.1)" />

      </View>
      
      {/* directions steps container */ }
      <TouchableOpacity onPress={toggleOpen} style={styles.directionStepsContainer}>
      <Text style={styles.directionStepsTitle}> Direction steps </Text>
        <Text style={styles.directionStepsPlusMinus}>{isOpen ? "-" : "+"}</Text>
      </TouchableOpacity>

      <View style={[styles.listContainer, !isOpen ? styles.hidden : undefined]}>
        <ScrollView showsVerticalScrollIndicator={true} style={{width: '100%'}}>

          <Text style={styles.directionStepsExitText}>Go to Metro Exit: {directionData.preferredExit.split(' ')[0]}</Text>
          {
            directionData.directionSteps?.map((step: DirectionStep, index: number) => {
              //console.log(`step.html_instructions is: ${step.html_instructions}`)
              let replacedHtmlInstructions = step.html_instructions.replaceAll('<b>', '')
              replacedHtmlInstructions = replacedHtmlInstructions.replaceAll('</b>', '')
              //let replacedHtmlInstructions = step.html_instructions.replaceAll('\n', '')
              return (
                <View key={index}>
                {
                  index % 2 ?
                    <View style={{ backgroundColor: '#f0f7ff', marginBottom: 5, marginHorizontal: 10}} key={index}>
                        <Text style={{marginBottom:1}} >Step: {index +1} - Distance: {step.distance.text},</Text>
                        <HTMLView value={replacedHtmlInstructions} />
                    </View>
                    : 
                    <View style={{ backgroundColor: '#e1ecf5', marginBottom: 5, marginHorizontal: 10}} key={index}>
                        <Text style={{marginBottom:1}} >Step: {index +1} - Distance: {step.distance.text},</Text>
                        <HTMLView value={replacedHtmlInstructions} />
                    </View>                  
                }
                </View>
              )
            })
          }
        </ScrollView>
        </View>
      </View>

      {/* Arrive at container */ }
      <View style={styles.arriveAtContainer}>
        <View style={styles.stationExitDirectionContainer}> 
            <Text style={styles.arriveAtTextGrey}> Arrive at </Text>
        </View>

        <View style={styles.stationExitDirectionContainer}> 
            <Entypo style={{marginLeft: 10, marginTop: 1}} name="address" color={'#4f4d4d'} size={23} />
            <Text style={styles.arriveAtText}> {directionData.endLocation.split(' ')[0]} </Text>
            <Text style={styles.arriveAtDurationText}>in approximately: {directionData.duration.text} </Text>
        </View>

        <View style={styles.separator} lightColor="grey" darkColor="rgba(255,255,255,0.1)" />
      </View>
    </>
  );
        }
  /*return (
    <View style={styles.container}>
      <Text style={styles.title}>Directions</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/ModalScreen.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */
      /*<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  ) */


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationExitContainer: {
      flexDirection: 'column',  
      marginBottom: 20,    
  },
  stationExitDirectionContainer: {
    flexDirection: 'row',
  },
  stationExitText: {
    marginBottom: 12, 
    marginTop: 10, 
    fontWeight: 'bold', 
    marginLeft: 10
  },
  stationExitStepTextGrey: {
    marginBottom: 20, 
    marginTop: 10, 
    marginLeft: 10,
    color: 'grey'
  },
  stationExitStepText: {
    marginBottom: 20, 
    marginTop: 10, 
    marginLeft: 10
  },
  directionStepsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  directionStepsExitText: {
    marginBottom: 20, 
    marginTop: 10, 
    fontWeight: 'bold', 
    marginLeft: 10
  },
  arriveAtContainer: {
    marginTop: 1,
    flexDirection: 'column',  
    marginBottom: 20,    
  },
 arriveAtTextGrey: {
    marginBottom: 7, 
    marginTop: 10, 
    marginLeft: 10,
    color: 'grey'
  },
  arriveAtText: {
    marginBottom: 20, 
    marginTop: 5, 
    marginLeft: 10
  },
  arriveAtDurationText: {
    marginBottom: 20, 
    marginTop: 5, 
  
  },
  separator: {
    marginVertical: 12,
    height: 1,
    width: '100%',
  },
  directionStepsPlusMinus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 15,
    marginBottom: 4,
  },
  directionStepsContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: "row",
    backgroundColor: 'white'
  },
  hidden: {
    height: 0,
  },
  listContainer: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    height: '45%',
    backgroundColor: 'white'
  },

});
