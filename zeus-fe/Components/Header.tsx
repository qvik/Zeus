import * as React from 'react'
import { useState } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { DestinationInput } from './DestinationInput'

const Header = (props: { handleSubmit: () => void }) => {
  useFonts({ Poppins_700Bold })
  const [selectedDestination, setSelectedDestination] = useState<string>('')

  return (
    <View style={styles.container}>
      <Image source={require('../assets/header.png')} style={styles.headerLogo} />
      <DestinationInput
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        handleSubmit={props.handleSubmit}
      />
    </View>
  )
}

export default Header

// Todo: Add correct CSS from figma
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '15%',
    backgroundColor: '#D9D9D9',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
  },
  headerLogo: {
    height: 55,
    width: 76,
    resizeMode: 'contain',
    marginRight: 20,
  },
})
