import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

//Screens
import Onboard from "screens/Onboard"
import UserSelection from "screens/Onboard/UserSelection"
import SliderScreen from "screens/Onboard/SliderScreen"
import SignIn from "screens/Auth"
import SignUp from "screens/Auth/SignUp"
import ForgotPassword from "screens/Auth/ForgotPassword"

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: true }}
    initialRouteName="SliderScreen"
  >
    <authStack.Screen name="Onboard" component={Onboard} />
    <authStack.Screen name="UserSelection" component={UserSelection} />
    <authStack.Screen name="SliderScreen" component={SliderScreen} />
    <authStack.Screen name="SignIn" component={SignIn} />
    <authStack.Screen name="SignUp" component={SignUp} />
    <authStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </authStack.Navigator>
)
export default AuthStackScreen
