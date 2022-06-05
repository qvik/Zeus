import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectCurrentAuth} from '../Redux/LoginSlice';
import { MainNavigator } from './MainNavigator'
import { LoginScreen } from '../LoginScreen/LoginScreen'

const Stack = createStackNavigator();

export const AppNavigator = () => { 
    const currentAuth = useSelector(selectCurrentAuth);

    return (
        <Stack.Navigator headerMode='none' >
          {currentAuth.authStatus === 'false'
            ? <Stack.Screen name="Login" component={LoginScreen} />
            : <Stack.Screen name="MainNav" component={MainNavigator} />
          }
          { /*<Stack.Screen name="SomeAnotherScreen" component={SomeAnotherScreen} options={{ headerShown: true }}/> */}
        </Stack.Navigator>
    )
  }