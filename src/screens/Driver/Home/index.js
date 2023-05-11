import React, {useEffect} from "react";
import {ActivityIndicator, Image, SafeAreaView, StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {getCurrentLocation} from "utils/Location";
import {Text} from "../../../components/index";
import {getAssignedOrders} from "../../../screenRedux/driverRedux";

const Home = () => {
  const {user: {id, name, driver}} = useSelector(state => state.loginReducer)
  const {loading, assignedOrders} = useSelector(state => state.driverReducer)
  const [position, setPosition] = React.useState(null)
  const dispatch = useDispatch()

  // const driverWebSocket = useUpdateDriverLocationWebsocket(id)

  const getPosition = () => {
    getCurrentLocation()
      .then(loc => {
        setPosition({
          latitude: loc.latitude,
          longitude: loc.longitude,
        })
      })
  }

  // console.log('assignedOrders', assignedOrders, driver)

  useEffect(() => {
    getPosition()
    dispatch(getAssignedOrders({driverId: id}))
    const interval = setInterval(() => {
      // getPosition()
    }, 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (position) {
      // console.log('ws-state', driverWebSocket.readyState)
      // driverWebSocket.sendJsonMessage({
      //   action: 'update_location',
      //   message: `POINT(${position.longitude} ${position.latitude})`,
      // })
    }
  }, [position])

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.header}>
        <Image source={{uri: driver?.photo}} style={{width: scale(34), height: scale(34), borderRadius: scale(17)}}/>
        <Text style={styles.name} color={'gray'} fontSize={12} variant={'strong'}>{name}</Text>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo} style={styles.logo}/>
          <Text variant={'h5'} color={'primary'} fontWeight={'700'}>Fast Drivers</Text>
        </View>
      </View>

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
        <View style={styles.overlay}>
          <View style={{alignItems: 'center'}}>
            {loading && <Text variant={'strong'} color={color.item} fontWeight={'600'}>Finding Orders</Text>}
          </View>
        </View>
      </MapView> : <ActivityIndicator/>}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  header: {
    height: scale(60),
    backgroundColor: color.white,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(20),
    position: 'relative'
  },
  name: {
    paddingLeft: scale(10)
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: widthPercentageToDP(50) - scale(17),
    // backgroundColor: 'red',
    height: scale(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    // width: scale(60),
    height: scale(34),
    resizeMode: 'contain'
  },
  container: {
    flex: 1, backgroundColor: color.white, padding: scaleVertical(25),
    position: 'relative',
  },
  driverMarker: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: 2,
    borderColor: color.primary,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'flex-start',
    padding: scale(20),
    left: widthPercentageToDP(5),
    right: widthPercentageToDP(5),
    bottom: heightPercentageToDP(2),
    height: heightPercentageToDP(15),
    borderRadius: scale(10),
    backgroundColor: color.white,
  }
})

export default Home;
