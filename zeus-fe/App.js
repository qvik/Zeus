import * as React from 'react';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { store } from './Features/Redux/Store';
import { Provider } from 'react-redux';
import { AppNavigator } from './Features/Routing/AppNavigator'

// --- App ---
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </Provider>
  )
};

export default App;
