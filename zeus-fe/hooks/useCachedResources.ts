import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { setCustomText } from 'react-native-global-props'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  const setDefaultFonts = () => {
    const customTextProps = {
      style: {
        fontFamily: 'poppins-regular',
        fontSize: 16,
      },
    }
    setCustomText(customTextProps)
  }

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'poppins-regular': require('../assets/fonts/Poppins-Regular.ttf'),
          'poppins-bold': require('../assets/fonts/Poppins_700Bold.ttf'),
        })
        setDefaultFonts()
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
