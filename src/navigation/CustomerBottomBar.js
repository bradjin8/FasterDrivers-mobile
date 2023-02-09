import React from "react"
import { Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Text } from "../components/index";
import { color, scaleVertical, scale } from "utils";
import { Images } from "src/theme"

import Settings from "screens/Customer/Settings"
import AccountInformation from "screens/Customer/Settings/AccountInformation";
import TermCondition from "screens/Restaurant/Settings/TermCondition";
import SendFeedback from "screens/Restaurant/Settings/SendFeedback";
import PrivacyPolicy from "screens/Restaurant/Settings/PrivacyPolicy";
import ChangePassword from "screens/Restaurant/Settings/ChangePassword"

import Home from "screens/Customer/Home"

import Orders from "screens/Customer/Orders"


const Tab = createBottomTabNavigator()
const settingStack = createStackNavigator()

const CustomerBottomBar = props => {
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
            <Text variant="text" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Home</Text>
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
        name="Orders"
        component={OrderTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="text" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Orders</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Menu}
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
            <Text variant="text" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Settings</Text>
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

export default CustomerBottomBar

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

const OrderTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Orders"
      >
        <settingStack.Screen name="Orders" component={Orders} />
      </settingStack.Navigator>
    </>
  )
}
