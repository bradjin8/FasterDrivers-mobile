import React from "react"
import { Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Text } from "../components/index";
import { color, scaleVertical, scale } from "utils";

import Settings from "screens/Restaurant/Settings"
import AccountInformation from "screens/Restaurant/Settings/AccountInformation";
import OrderAcceptance from "screens/Restaurant/Settings/OrderAcceptance";
import TermCondition from "screens/Restaurant/Settings/TermCondition";
import SendFeedback from "screens/Restaurant/Settings/SendFeedback";
import PrivacyPolicy from "screens/Restaurant/Settings/PrivacyPolicy";
import RestaurantProfile from "screens/Restaurant/Settings/RestaurantProfile"
import ChangePassword from "screens/Restaurant/Settings/ChangePassword"

import Menu from "screens/Restaurant/Menu"
import AddNewDish from "screens/Restaurant/Menu/AddNewDish"

import Home from "screens/Restaurant/Home"

import Map from "screens/Restaurant/Map"
import { Images } from "src/theme"

const Tab = createBottomTabNavigator()
const settingStack = createStackNavigator()

const RestaurantBottomBar = props => {
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
        name="Menu"
        component={MenuTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="text" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Menu</Text>
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
        name="Map"
        component={MapTab}
        options={{
          tabBarLabel: ({focused, color, size}) => (
            <Text variant="text" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Map</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Map}
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

export default RestaurantBottomBar

const SettingTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Settings"
      >
        <settingStack.Screen name="Settings" component={Settings} />
        <settingStack.Screen name="RestaurantProfile" component={RestaurantProfile} />
        <settingStack.Screen name="ChangePassword" component={ChangePassword} />
        <settingStack.Screen name="AccountInformation" component={AccountInformation} />
        <settingStack.Screen name="OrderAcceptance" component={OrderAcceptance} />
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

const MapTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Map"
      >
        <settingStack.Screen name="Map" component={Map} />
      </settingStack.Navigator>
    </>
  )
}

const MenuTab = () => {
  return (
    <>
      <settingStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="Menu"
      >
        <settingStack.Screen name="Menu" component={Menu} />
        <settingStack.Screen name="AddNewDish" component={AddNewDish} />
      </settingStack.Navigator>
    </>
  )
}
