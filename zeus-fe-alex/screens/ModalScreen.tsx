import React, { useState, useCallback, useEffect, } from "react";
import { StyleSheet, LayoutAnimation, TouchableOpacity, ScrollView } from 'react-native';
import { useAppSelector } from '../components/Redux/Hooks';
import { selectCurrentDirectionData } from '../components/Redux/DirectionsSlice';
import { Text, View } from '../components/Themed';
import HTMLView from 'react-native-htmlview'

export default function ModalScreen() {
  const [isOpen, setIsOpen] = useState(false);
  //let prefExit = props.preferredExit.split(' ')[0]

  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const [directionData, setDirectionData] = useState(useAppSelector(selectCurrentDirectionData))

  useEffect( () => {
    console.log(`directionData in modalScreen is: ${JSON.stringify(directionData)}`)
  }, [directionData])

  return (
    <>
      <TouchableOpacity onPress={toggleOpen} style={styles.heading}>
        
        <Text style={styles.plusMinus}>{isOpen ? "-" : "+"}</Text>
      </TouchableOpacity>

      <View style={[styles.listContainer, !isOpen ? styles.hidden : undefined]}>
        <ScrollView showsVerticalScrollIndicator={true} style={{width: '100%'}}>

          <Text style={{marginBottom: 20, marginTop: 5, fontWeight: 'bold'}}>Go to Metro Exit: {}</Text>
          {
            directionData.directionSteps?.map((step: any, index: number) => {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  heading: {
    height: 40,
    alignItems: "center",
    flexDirection: "row",
  },
  hidden: {
    height: 0,
  },
  listContainer: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    height: '50%',
    backgroundColor: 'white'
  },
  plusMinus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 20,
    marginBottom: 4,
  }
});
