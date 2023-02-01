import React from "react"
import { View, Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "screens/Home"

const Tab = createBottomTabNavigator()
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

import { Images } from "src/theme"
const {
  HomeOn,
} = Images

const BottomNavigator = props => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#242A38",
          height: hp(`${hp("100%") >= 800 ? "10%" : "9%"}`)
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? HomeOn : HomeOn}
              style={{ width: 23, height: 21 }}
            />
          ),
          header: () => null
        }}
      />
    </Tab.Navigator>
  )
}
export default BottomNavigator
