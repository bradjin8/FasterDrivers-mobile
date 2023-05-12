import DriverHeader from "components/DriverHeader";
import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Linking, Pressable, SafeAreaView, StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import {useDispatch, useSelector} from "react-redux";
import orderDetails from "screens/Customer/Orders/OrderDetails";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {extractLatLong, getCurrentLocation} from "utils/Location";
import {useUpdateDriverLocationWebsocket} from "utils/web-socket";
import {Button, Text} from "../../../components/index";
import {ORDER_STATUS} from "../../../consts/orders";
import {deliverOrder, getAssignedOrders, pickupOrder} from "../../../screenRedux/driverRedux";

const MESSAGE = {
  FINDING: "Finding Orders...",
  ACCEPTING: "Accepting Order...",
  REJECTING: "Rejecting Order...",
  COMPLETING: "Completing Order...",
}
const Home = ({navigation}) => {
  const {user: {id, name, driver}} = useSelector(state => state.loginReducer)
  const {loading, assignedOrders, needToRefresh} = useSelector(state => state.driverReducer)
  const dispatch = useDispatch()

  const [position, setPosition] = React.useState(null)
  const [orderIdx, setOrderIdx] = React.useState(-1)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState(MESSAGE.FINDING)


  const driverWebSocket = useUpdateDriverLocationWebsocket(id, false)

  const getPosition = () => {
    getCurrentLocation()
      .then(loc => {
        setPosition({
          latitude: loc.latitude,
          longitude: loc.longitude,
        })
      })
  }

  // console.log('assignedOrders', assignedOrders)
  const fetchOrders = () => {
    setMessage(MESSAGE.FINDING)
    dispatch(getAssignedOrders({driverId: id}))
  }

  const accept = (orderId) => {
    setModal(false)
    setOrderIdx(-1)
    setMessage(MESSAGE.ACCEPTING)
    dispatch(pickupOrder({orderId}))
  }

  const reject = (orderId) => {
    setModal(false)
    setOrderIdx(-1)
    setMessage(MESSAGE.REJECTING)
  }

  const complete = (orderId) => {
    setModal(false)
    setOrderIdx(-1)
    setMessage(MESSAGE.COMPLETING)
    dispatch(deliverOrder({orderId}))
  }

  useEffect(() => {
    getPosition()
    const interval = setInterval(() => {
      getPosition()
    }, 30 * 1000)

    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders()
    })
    fetchOrders()
    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (needToRefresh) {
      fetchOrders()
    }
  }, [needToRefresh])

  useEffect(() => {
    if (position) {
      // console.log('ws-state', driverWebSocket.readyState)
      const data = JSON.stringify({
        action: 'update_location',
        message: `POINT(${position.longitude} ${position.latitude})`,
      })
      // console.log(data)
      driverWebSocket.sendMessage(data)
    }
  }, [position])

  const renderSelectedOrderDetail = () => {
    if (orderIdx < 0 || orderIdx >= assignedOrders.length) return null

    const {id, address, fees, status, total, restaurant, user} = assignedOrders[orderIdx]

    console.log('order', status)
    const deliveryAddress = user?.customer?.addresses?.find(add => add.id === address) || {}

    const renderAction = () => {
      if (status === ORDER_STATUS.Accepted) {
        return <View style={styles.action}>
          <Button
            text={'Accept Order'} textColor={'white'} style={styles.accept} fontSize={16} fontWeight={'600'}
            onPress={() => accept(id)}
          />
          <Pressable onPress={() => reject(id)}>
            <Text variant={'strong'} fontSize={12}>Reject Order</Text>
          </Pressable>
        </View>
      }

      if (status === ORDER_STATUS.DriverAssigned) {
        return <View style={styles.action}>
          <Button
            text={'Delivered'} textColor={'white'} style={styles.accept} fontSize={16} fontWeight={'600'}
            onPress={() => complete(id)}
          />
        </View>
      }
    }

    return <Pressable
      style={{
        ...styles.overlay,
        height: scale(modal ? 260 : 140),
      }}
      onPress={() => !modal && setModal(true)}
    >
      {modal && <View style={styles.price}>
        <Text variant={'h5'}>${total}</Text>
      </View>}
      <View style={{flexDirection: 'row'}}>
        <View style={styles.images}>
          <View style={styles.marketMarker}>
            <Image source={Images.Market} style={{width: scale(20), height: scale(20)}} resizeMode={'contain'}/>
          </View>
          <View style={styles.line}/>
          <View style={styles.driverMarker}>
            <Entypo name={'location-pin'} size={34}/>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.restaurant}>
            <Text fontSize={12} variant={'strong'}>{restaurant.name}</Text>
            <Text fontSize={12}>{restaurant.street} {restaurant.city}, {restaurant.state} {restaurant.zip_code}</Text>
          </View>
          <View style={styles.customer}>
            <Text fontSize={12} variant={'strong'}>{user?.name}</Text>
            <Text fontSize={12}>{deliveryAddress.street} {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip_code}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${user?.customer?.phone}`)}>
              <Text color={'primary'} variant={'strong'} fontSize={12}>{user?.customer?.phone}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {modal && renderAction()}
    </Pressable>
  }

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <DriverHeader photo={driver?.photo} name={name}/>
      {position ? <MapView
        style={styles.container}
        region={{
          ...position,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={position} anchor={{x: 0.5, y: 0.5}}>
          <View style={styles.driverMarker}>
            <Entypo name={'location-pin'} size={34}/>
          </View>
        </Marker>
        {assignedOrders.map((order, idx) => {
          const {id, restaurant: {location}} = order
          const loc = extractLatLong(location)
          return (
            <Marker
              key={id}
              coordinate={loc}
              anchor={{x: 0.5, y: 0.5}}
              onPress={() => {
                setOrderIdx(idx === orderIdx ? -1 : idx)
              }}
            >
              <View style={styles.marketMarker}>
                <Image source={Images.Market} style={{width: scale(20), height: scale(20)}} resizeMode={'contain'}/>
              </View>
            </Marker>
          )
        })}
      </MapView> : <ActivityIndicator/>}
      {loading && <View style={styles.finding}>
        <Text variant={'strong'} color={color.item} fontWeight={'600'}>{message}</Text>
      </View>}
      {renderSelectedOrderDetail()}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {
    flex: 1, backgroundColor: color.white, padding: scaleVertical(25),
    position: 'relative',
  },
  driverMarker: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    borderWidth: 2,
    borderColor: color.primary,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketMarker: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finding: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: scale(20),
    left: widthPercentageToDP(5),
    right: widthPercentageToDP(5),
    bottom: heightPercentageToDP(2),
    height: heightPercentageToDP(7),
    borderRadius: scale(10),
    backgroundColor: color.white,
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'space-between',
    padding: scale(15),
    left: widthPercentageToDP(5),
    right: widthPercentageToDP(5),
    bottom: heightPercentageToDP(2),
    height: scale(140),
    borderRadius: scale(10),
    backgroundColor: color.white,
  },
  images: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: scale(10),
  },
  line: {
    height: scale(30),
    width: 0,
    borderColor: color.primary,
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  info: {
    marginLeft: scale(10),
    justifyContent: 'space-between',
  },
  restaurant: {
    height: scale(34),
    justifyContent: 'space-evenly'
  },
  customer: {
    height: scale(50),
    justifyContent: 'space-evenly'
  },
  price: {
    alignItems: 'center',
    height: scale(30)
  },
  action: {
    alignItems: 'center',
    height: scale(80),
    justifyContent: 'space-evenly',
  },
  accept: {
    height: scale(40),
    width: scale(120),
  }
})

export default Home;
