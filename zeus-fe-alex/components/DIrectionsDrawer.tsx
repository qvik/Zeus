import React, { useState, useCallback } from "react";
import { View, FlatList, LayoutAnimation, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import HTMLView from 'react-native-htmlview'
import { Text } from '../components/Themed';
import { StationPicker } from '../components/StationPicker'

export const DirectionsDrawer = (props: { title: string , items: DirectionStep[] | undefined, preferredExit: string }) => {
  console.log(`items in DirectionsDrawer is: ${JSON.stringify(props.items)}`)
  const [isOpen, setIsOpen] = useState(false);
  let prefExit = props.preferredExit.split(' ')[0]

  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <>
      <TouchableOpacity onPress={toggleOpen} style={styles.heading}>
        <Text>{props.title}</Text>
        <Text style={styles.plusMinus}>{isOpen ? "-" : "+"}</Text>
      </TouchableOpacity>

      <View style={[styles.listContainer, !isOpen ? styles.hidden : undefined]}>
        <ScrollView showsVerticalScrollIndicator={true} style={{width: '100%'}}>

          <Text style={{marginBottom: 20, marginTop: 5, fontWeight: 'bold'}}>Go to Metro Exit: {prefExit}</Text>
          {
            props.items?.map((step: any, index: number) => {
              console.log(`step.html_instructions is: ${step.html_instructions}`)
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
};

const styles = StyleSheet.create({
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
