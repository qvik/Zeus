import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../components/Redux/Hooks';
import { selectCurrentDirections } from '../components/Redux/DirectionsSlice';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {

  //const directions = useAppSelector(selectCurrentDirections)
  const [directions, setDirections] = useState(useAppSelector(selectCurrentDirections))

  useEffect( () => {
    console.log(`directions in modalScreen is: ${JSON.stringify(directions)}`)
  }, [directions])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directions</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/ModalScreen.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

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
});
