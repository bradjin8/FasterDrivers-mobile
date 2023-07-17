import React from "react"
import {StyleSheet, Linking} from "react-native"
import {createStackNavigator} from "@react-navigation/stack"
import StripeWebView from "screens/Restaurant/Settings/StripeWebView";

//Screens
import RestaurantBottomBar from "./RestaurantBottomBar"
import CustomerBottomBar from "./CustomerBottomBar"
import DriverBottomBar from "./DriverBottomBar"
import {useSelector} from "react-redux";
import Onboard from "screens/Onboard";

const mainStack = createStackNavigator()

const ApplicationStack = props => {
  const user = useSelector(state => state.loginReducer.user)
  const userType = user?.type;

  if (userType === 'Restaurant') {
    return (
      <>
        <mainStack.Navigator
          screenOptions={{headerShown: false, animationEnabled: false}}
          initialRouteName="RestaurantBottomBar"
        >
          <mainStack.Screen name="RestaurantBottomBar" component={RestaurantBottomBar}/>
          <mainStack.Screen name="StripeWebView" component={StripeWebView}/>
        </mainStack.Navigator>
      </>
    )
  } else if (userType === 'Customer') {
    return (
      <>
        <mainStack.Navigator
          screenOptions={{headerShown: false, animationEnabled: false}}
          initialRouteName="CustomerBottomBar"
        >
          <mainStack.Screen name="CustomerBottomBar" component={CustomerBottomBar}/>
        </mainStack.Navigator>
      </>
    )
  } else if (userType === 'Driver') {
    return (
      <>
        <mainStack.Navigator
          screenOptions={{headerShown: false, animationEnabled: false}}
          initialRouteName="DriverBottomBar"
        >
          <mainStack.Screen name="DriverBottomBar" component={DriverBottomBar}/>
          <mainStack.Screen name="StripeWebView" component={StripeWebView}/>
        </mainStack.Navigator>
      </>
    )
  } else {
    return (
      <mainStack.Navigator
        screenOptions={{headerShown: false, animationEnabled: false}}
        initialRouteName="Onboard"
      >
        <mainStack.Screen name="Onboard" component={Onboard}/>
      </mainStack.Navigator>
    )
  }
}

export default ApplicationStack

const styles = StyleSheet.create({
  messageBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
})
