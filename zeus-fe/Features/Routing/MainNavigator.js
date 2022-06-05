import * as React from 'react';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { StartScreen } from '../StartScreen/StartScreen'


const Tab = createBottomTabNavigator();

export const MainNavigator = (props) => {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTransparent:true,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#08060B',
          paddingLeft: 10
        },
      }}         
    >
      <Tab.Screen name="Start" options={{headerShown:false}} component={StartScreen} />
    </Tab.Navigator>
  )
}
