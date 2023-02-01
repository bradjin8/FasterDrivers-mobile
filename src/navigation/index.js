import React, { useEffect } from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector, useDispatch } from "react-redux"
import { navigationRef } from "./NavigationService"
import { color } from "utils"
import { setAccessToken } from "../screenRedux/loginRedux"

import AuthStackScreen from "./AuthScreens"
import ApplicationStack from "./ApplicationStack"

const stack = createStackNavigator()

const Navigation = props => {
  const accessToken = useSelector(state => state.loginReducer.accessToken)
  // const dispatch = useDispatch()
  // dispatch(setAccessToken('accessToken'))
  
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        ...DefaultTheme,
        background: color.black
      }}
    >
      <stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <stack.Screen name="ApplicationStack" component={ApplicationStack} />
        ) : (
          <stack.Screen name="AuthStack" component={AuthStackScreen} />
        )}
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;
