import React from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements/dist/list/ListItem'
import HTMLView from 'react-native-htmlview'

export const DirectionsBox = ({ directions, preferredExit }: string | any) => {
  return (
    <ScrollView style={styles.directionsScrollView}>
      <Text style={styles.directionsText}>Directions: </Text>
      <Text style={styles.atExitText}>At exit {preferredExit.split(' ')[0]} </Text>
      {directions?.map((step: any, index: number) => {
        let replacedHtmlInstructions = step.html_instructions.replace('<b>', '')
        replacedHtmlInstructions = replacedHtmlInstructions.replace('</b>', '')
        return (
          <View key={index}>
            <View style={{ marginLeft: 40 }}>
              <Text style={{ marginBottom: 2 }}>
                Step {index + 1}: Distance: {step.distance.text},
              </Text>
              <HTMLView value={replacedHtmlInstructions} />
            </View>
            <ListItem bottomDivider style={styles.bottomDividerListItem}></ListItem>
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  directionsScrollView: {
    padding: 8,
    height: 220,
    borderWidth: 3,
    borderRadius: 4,
    position: 'absolute',
    bottom: 24,
    backgroundColor: 'white',
    width: '90%',
  },
  directionsText: {
    fontWeight: '700',
    marginBottom: 15,
    marginLeft: 10,
  },
  atExitText: {
    marginBottom: 15,
    marginLeft: 30,
  },
  bottomDividerListItem: {
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
  },
})
