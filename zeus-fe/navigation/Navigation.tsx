/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../Constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../Screens/ModalScreen';
import NotFoundScreen from '../Screens/NotFoundScreen';
import { TabMetroExitsScreen } from '../Screens/TabMetroExitsScreen';
import { TabSettingsScreen } from '../Screens/TabSettingsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>      
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>(); //must be in RootStackParamList ../types.tsx

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>(); //must be in RootTabParamList ../types.tsx

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabMetroExits" //default route(screen) to render must be in RootTabParamList //must be in RootTabParamList ../types.tsx
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabMetroExits" //must be in RootTabParamList
        component={TabMetroExitsScreen}
        options={({ navigation }: RootTabScreenProps<'TabMetroExits'>) => ({
          title: 'Metro Exits Finder',
          tabBarIcon: ({ color }) => <TabBarIconMaterialCommunity name="exit-run" color={'black'} size={20}/>,
          headerStyle: {backgroundColor: 'white'},
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="map"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabSettings" //must be in RootTabParamList //must be in RootTabParamList ../types.tsx
        component={TabSettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color}) => <TabBarIconMaterialCommunity name="account-settings" color={'black'} size={30} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIconMaterialCommunity(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  size: number
}) {
  return <MaterialCommunityIcons style={{ marginBottom: -3 }} {...props} />;
}