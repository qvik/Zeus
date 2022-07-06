/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList
  }
}

//parameters in Navigation.tsx for const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined //createBottomTabNavigator with params in RootTabParamList
  Modal: undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

//for each bottom tab screen in Navigation.tsx const BottomTab = createBottomTabNavigator<RootTabParamList>();
// see row 18
export type RootTabParamList = {
  TabMetroExits: undefined
  TabSettings: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>
