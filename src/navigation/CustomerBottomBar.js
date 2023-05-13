import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {createStackNavigator} from "@react-navigation/stack"
import React, {useEffect, useState} from "react";
import {Image, View} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {useSelector} from "react-redux";

import Home from "screens/Customer/Home"
import Cart from "screens/Customer/Home/Cart"
import RestaurantDetails from "screens/Customer/Home/RestaurantDetails"

import AddCard from "screens/Customer/Orders/AddCard"
import OrderDetails from "screens/Customer/Orders/OrderDetails"
import OrderOnMap from "screens/Customer/Orders/OrderOnMap";
import Orders from "screens/Customer/Orders/Orders"
import Payment from "screens/Customer/Orders/Payment"

import Settings from "screens/Customer/Settings"
import AccountInformation from "screens/Customer/Settings/AccountInformation";
import ChangePassword from "screens/Restaurant/Settings/ChangePassword"
import PrivacyPolicy from "screens/Restaurant/Settings/PrivacyPolicy";
import SendFeedback from "screens/Restaurant/Settings/SendFeedback";
import TermCondition from "screens/Restaurant/Settings/TermCondition";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {Text} from "../components/index";

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
        tabBarLabelPosition: 'below-icon',
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
            <SimpleLineIcons name={'home'} size={scale(22)} color={focused ? color.black : color.gray} />
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
              <Feather name={'shopping-cart'} size={scale(24)} color={focused ? color.black : color.gray} />
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
              resizeMode={'contain'}
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
        <settingStack.Screen name="OrderOnMap" component={OrderOnMap} />
        <settingStack.Screen name="Payment" component={Payment} />
        <settingStack.Screen name="AddCard" component={AddCard} />
      </settingStack.Navigator>
    </>
  )
}
