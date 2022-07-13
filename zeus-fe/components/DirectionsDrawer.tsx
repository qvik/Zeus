
import React, { useState, useCallback } from 'react'
import { View, FlatList, LayoutAnimation, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { Text } from './Themed'
import { DirectionData } from 'types/ObjectTypes'

export const DirectionsDrawer = (props: {title: string, data: DirectionData | undefined }) => {
  //console.log(`data in DirectionsDrawer is: ${JSON.stringify(props.data)}`)
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [])

  return (
    <>
      <TouchableOpacity onPress={toggleOpen} style={styles.heading}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.plusMinus}>{isOpen ? '-' : '+'}</Text>
      </TouchableOpacity>

      <View style={[styles.listContainer, !isOpen ? styles.hidden : undefined]}>
        <ScrollView showsVerticalScrollIndicator={true} style={{ width: '100%' }}>

          <Text style={styles.listItemTitle}>Go to Metro Exit: {props.data?.preferredExit.split(' ')[0]}</Text>
          {props.data?.directionSteps?.map((step: any, index: number) => {
            //console.log(`step.html_instructions is: ${step.html_instructions}`)
            let replacedHtmlInstructions = step.html_instructions.replaceAll('<b>', '')
            replacedHtmlInstructions = replacedHtmlInstructions.replaceAll('</b>', '')
            //let replacedHtmlInstructions = step.html_instructions.replaceAll('\n', '')
            return (
              <View key={index}>
                {index % 2 ? (
                  <View style={{ backgroundColor: '#f0f7ff', marginBottom: 5, marginHorizontal: 10 }} key={index}>
                    <Text style={{ marginBottom: 1 }}> Step: {index + 1} - Distance: {step.distance.text}</Text>
                    <HTMLView value={replacedHtmlInstructions} />
                  </View>
                ) : (
                  <View style={{backgroundColor: '#e1ecf5', marginBottom: 5, marginHorizontal: 10}} key={index}>
                    <Text style={{ marginBottom: 1 }}> Step: {index + 1} - Distance: {step.distance.text}, </Text>
                    <HTMLView value={replacedHtmlInstructions} />
                  </View>
                )}
              </View>
            )
          })}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'poppins_extraLight',
  },
  heading: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: 'white',
    width: '100%'
  },
  listItemTitle: {
    fontFamily: 'poppins_700Bold',
    marginBottom: 20, 
    marginTop: 5,
  },
  listItemTxt: {
    fontFamily: 'poppins_extraLight',
    marginBottom: 1,
  },
  hidden: {
    height: 0,
  },
  listContainer: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    height: '50%',
    backgroundColor: 'white',
    width: '100%',
    alignItems: "center",
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
