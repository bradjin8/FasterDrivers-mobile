import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {createStackNavigator} from "@react-navigation/stack"
import React from "react"
import {Image} from "react-native"

import History from "screens/Driver/History"

import Home from "screens/Driver/Home"

import Settings from "screens/Driver/Settings"
import AccountInformation from "screens/Driver/Settings/AccountInformation";
import CarDetails from "screens/Driver/Settings/CarDetails";

import Wallet from "screens/Driver/Wallet"
import ChangePassword from "screens/Restaurant/Settings/ChangePassword"
import InviteFriends from "screens/Restaurant/Settings/InviteFriends";
import PrivacyPolicy from "screens/Restaurant/Settings/PrivacyPolicy";
import SendFeedback from "screens/Restaurant/Settings/SendFeedback";
import TermCondition from "screens/Restaurant/Settings/TermCondition";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {Text} from "../components/index";


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
          tabBarLabelPosition: 'below-icon',
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="strong" color={focused ? 'primary' : 'black'} fontSize={14} fontWeight="700">Home</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Home}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.primary : color.black }}
              resizeMode={'contain'}
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
            <Text variant="strong" color={focused ? 'primary' : 'black'} fontSize={14} fontWeight="700">History</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.History}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.primary : color.black }}
              resizeMode={'contain'}
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
            <Text variant="strong" color={focused ? 'primary' : 'black'} fontSize={14} fontWeight="700">Wallet</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Wallet}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.primary : color.black }}
              resizeMode={'contain'}
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
            <Text variant="strong" color={focused ? 'primary' : 'black'} fontSize={14} fontWeight="700">Settings</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Settings}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.primary : color.black }}
              resizeMode={'contain'}
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
        <settingStack.Screen name="InviteFriends" component={InviteFriends} />
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
