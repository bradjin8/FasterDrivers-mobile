import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

//Screens
import Setting from "screens/Setting"

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: false }}
    initialRouteName="Setting"
  >
    <authStack.Screen name="Setting" component={Setting} />
  </authStack.Navigator>
)
export default AuthStackScreen
