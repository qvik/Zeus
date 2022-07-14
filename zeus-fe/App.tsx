import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import { TabMetroExitsScreen } from './screens/TabMetroExitsScreen'
import { store, persistor } from './components/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

export default function App() {
  const isLoadingComplete = useCachedResources()
  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}></PersistGate>
        <SafeAreaProvider>
          <TabMetroExitsScreen />
            <StatusBar style="dark" />
        </SafeAreaProvider>
      </Provider>
    )
  }
}
