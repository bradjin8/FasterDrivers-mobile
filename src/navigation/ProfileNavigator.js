import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { color } from 'utils';
import Setting from "screens/Setting"

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: {
          backgroundColor: color.black
        }
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={Setting}
      />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
