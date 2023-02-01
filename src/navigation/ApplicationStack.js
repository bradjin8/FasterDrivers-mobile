import React from "react"
import {  StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"

//Screens
import Setting from "screens/Setting"
import BottomNavigator from "./Main"

import { Text } from "components"
import { color } from "utils"

const mainStack = createStackNavigator()

const ApplicationStack = props => {
  return (
    <>
      <mainStack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <mainStack.Screen name="BottomBar" component={BottomNavigator} />
        <mainStack.Screen name="Setting" component={Setting} />
      </mainStack.Navigator>
    </>
  )
}

export default ApplicationStack

const styles = StyleSheet.create({
  messageBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
})
