import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
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
import RestaurantDetails from "screens/Customer/Home/RestaurantDetails"
import Cart from "screens/Customer/Home/Cart"

import Orders from "screens/Customer/Orders/Orders"
import OrderDetails from "screens/Customer/Orders/OrderDetails"
import Payment from "screens/Customer/Orders/Payment"
import AddCard from "screens/Customer/Orders/AddCard"

import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator()
const settingStack = createStackNavigator()

const tabBarStyle = {
  backgroundColor: color.white,
  height: scaleVertical(60),
  tabBarActiveTintColor: color.black,
  tabBarInactiveTintColor: color.gray,
  paddingTop: scaleVertical(5)
}

const CustomerBottomBar = props => {
  const cartItemsReducer = useSelector(state => state.customerReducer.carts)
  const [cartItems, setCartItems] = useState(cartItemsReducer)

  useEffect(() => {
    setCartItems(cartItemsReducer)
  }, [cartItemsReducer]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        animationEnabled: true,
        tabBarStyle: tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarStyle: {
            ...tabBarStyle,
            display: props.route.state?.routes?.[0].state?.index > 0 ? 'none' : 'flex',
          },
          tabBarLabel: ({ focused }) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Home</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Home}
              style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
              resizeMode={'contain'}
            />
          ),
          header: () => null,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderTab}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Orders</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              {false && cartItems.length ? <View style={{
                position: 'absolute',
                right: -20,
                top: -8,
                width: 25,
                height: 25,
                borderRadius: 12.5,
                zIndex: 1,
                borderColor: color.white,
                borderWidth: scale(1.5),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color.angry
              }}>
                <Text variant="strong" color="white" fontSize={12} fontWeight="600">
                  {cartItems.length}
                </Text>
              </View> : null}
              <Image
                source={Images.orders}
                style={{ width: scale(22), height: scale(22), tintColor: focused ? color.black : color.gray }}
              />
            </View>
          ),
          header: () => null
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingTab}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text variant="strong" color={focused ? 'black' : 'gray'} fontSize={14} fontWeight="700">Settings</Text>
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
        <settingStack.Screen name="Cart" component={Cart} />
        <settingStack.Screen name="RestaurantDetails" component={RestaurantDetails} />
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
        <settingStack.Screen name="OrderDetails" component={OrderDetails} />
        <settingStack.Screen name="Payment" component={Payment} />
        <settingStack.Screen name="AddCard" component={AddCard} />
      </settingStack.Navigator>
    </>
  )
}
