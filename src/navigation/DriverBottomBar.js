import React from "react"
import { Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Text } from "../components/index";
import { color, scaleVertical, scale } from "utils";
import { Images } from "src/theme"

import Settings from "screens/Driver/Settings"
import AccountInformation from "screens/Driver/Settings/AccountInformation";
import CarDetails from "screens/Driver/Settings/CarDetails";
import TermCondition from "screens/Restaurant/Settings/TermCondition";
import SendFeedback from "screens/Restaurant/Settings/SendFeedback";
import PrivacyPolicy from "screens/Restaurant/Settings/PrivacyPolicy";
import ChangePassword from "screens/Restaurant/Settings/ChangePassword"

import Home from "screens/Driver/Home"

import History from "screens/Driver/History"

import Wallet from "screens/Driver/Wallet"


const Tab = createBottomTabNavigator()
const settingStack = createStackNavigator()

const DriverBottomBar = props => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: color.white,
          height: scaleVertical(65),
          tabBarActiveTintColor: color.black,
          tabBarInactiveTintColor: color.gray,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Home</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Home}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
            />
          ),
          header: () => null
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">History</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.history}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
            />
          ),
          header: () => null
        }}
      />
     <Tab.Screen
        name="Wallet"
        component={WalletTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Wallet</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.OrderAcceptance}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
            />
          ),
          header: () => null
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Settings</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Settings}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
            />
          ),
          header: () => null
        }}
      />
    </Tab.Navigator>
  )
}

export default DriverBottomBar

const SettingTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Settings"
      >
        <settingStack.Screen name="Settings" component={Settings} />
        <settingStack.Screen name="ChangePassword" component={ChangePassword} />
        <settingStack.Screen name="AccountInformation" component={AccountInformation} />
        <settingStack.Screen name="CarDetails" component={CarDetails} />
        <settingStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <settingStack.Screen name="TermCondition" component={TermCondition} />
        <settingStack.Screen name="SendFeedback" component={SendFeedback} />
      </settingStack.Navigator>
    </>
  )
}

const HomeTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Home"
      >
        <settingStack.Screen name="Home" component={Home} />
      </settingStack.Navigator>
    </>
  )
}

const HistoryTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="History"
      >
        <settingStack.Screen name="History" component={History} />
      </settingStack.Navigator>
    </>
  )
}

const WalletTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Wallet"
      >
        <settingStack.Screen name="Wallet" component={Wallet} />
      </settingStack.Navigator>
    </>
  )
}
