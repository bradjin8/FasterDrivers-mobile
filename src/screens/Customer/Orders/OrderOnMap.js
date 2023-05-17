import SimpleHeader from "components/SimpleHeader";
import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Image, Linking, Pressable, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import MapView, {Marker, Polyline} from "react-native-maps";
import {heightPercentageToDP, widthPercentageToDP as wp, widthPercentageToDP} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {extractLatLong} from "utils/Location";
import {useUpdateDriverLocationWebsocket} from "utils/web-socket";
import {Text} from "../../../components/index";
import {getRoute} from "../../../third-party/google";

const OrderOnMap = ({navigation, route}) => {
  const order = route.params?.order || {}
  const {user} = useSelector(state => state.loginReducer)

  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const [restaurantLocation, setRestaurantLocation] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [showInfo, setShowInfo] = useState(true)

  const [routes, setRoutes] = useState([])

  const mapView = useRef(null)


  const driverWebSocket = useUpdateDriverLocationWebsocket(order?.driver?.id, false)

  const calculatePositions = () => {
    const deliveryAddress = order.user?.customer?.addresses?.find(address => address.id === order.address)
    setDeliveryLocation(extractLatLong(deliveryAddress?.location))
    setRestaurantLocation(extractLatLong(order.restaurant?.location))
    setDriverLocation(extractLatLong(order.driver?.driver?.location))
  }

  const calculateRoutes = async () => {
    const _routes = await Promise.all([
      getRoute(driverLocation, deliveryLocation),
      getRoute(restaurantLocation, driverLocation),
    ])
    // console.log('routes', _routes)
    setRoutes(_routes)
  }

  useEffect(() => {
    if (driverLocation && restaurantLocation && deliveryLocation) {
      calculateRoutes()
    }
  }, [driverLocation, restaurantLocation, deliveryLocation])

  useEffect(() => {
    calculatePositions()
  }, [order])

  useEffect(() => {
    if (driverWebSocket.lastMessage) {
      try {
        const parsedData = JSON.parse(driverWebSocket.lastMessage.data)
        const loc = extractLatLong(parsedData.message)
        // console.log('parsedData', loc)
        if (loc)
          setDriverLocation(loc)
      } catch (e) {
        // console.log('parse-location-error', e.message)
      }
    }
  }, [driverWebSocket.lastMessage])

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Track Order"
        showBackIcon={true}
      />
      {deliveryLocation ?
        <MapView
          ref={mapView}
          style={styles.container}
          initialRegion={{
            ...deliveryLocation,
            longitudeDelta: 0.0922,
            latitudeDelta: 0.0421,
          }}
          onMapReady={() => {
            mapView.current.fitToCoordinates([driverLocation, restaurantLocation, deliveryLocation], {
              edgePadding: {
                top: 100,
                right: 100,
                bottom: 200,
                left: 100,
              },
              animated: true,
            })
          }}
        >
          {driverLocation && <Marker
            coordinate={driverLocation}
            zIndex={1000}
          >
            <View
              style={styles.driverMarker}
            >
              <Ionicons name="bicycle" size={26} color={color.item}/>
            </View>
          </Marker>}

          {restaurantLocation && <Marker
            coordinate={restaurantLocation}
            zIndex={90}
          >
            <View style={styles.marketMarker}>
              <Image source={Images.Market} style={{width: scale(20), height: scale(20)}} resizeMode={'contain'}/>
            </View>
          </Marker>}

          {deliveryLocation && <Marker coordinate={deliveryLocation}>
            <View style={styles.driverMarker}>
              <Entypo name={'location-pin'} size={34}/>
            </View>
          </Marker>}

          {routes.length > 0 && routes.map((route, index) => (
            <Polyline
              key={index}
              coordinates={route}
              strokeWidth={3}
              strokeColor={index === 0 ? color.darkGray : color.primary}
            />
          ))}
        </MapView>
        :
        <ActivityIndicator/>
      }


      {showInfo && <View style={styles.finding}>
        <View style={styles.driverContainer}>
          <View style={styles.flex}>
            <Image source={{uri: order?.driver?.driver?.photo}} style={styles.avatar} resizeMode={'cover'}/>
            <View style={styles.column}>
              <Text color={'itemPrimary'} fontSize={12} variant={'h5'}>Courier</Text>
              <Text variant={'strong'}>Wade Warren</Text>
            </View>
          </View>
          <Pressable style={styles.phone} onPress={() => {
            const url = `tel:${order?.driver?.driver?.phone}`
            Linking.openURL(url)
              .then((res) => {
                if (!res)
                  showMessage({
                    message: 'Driver does not have a phone number',
                    type: 'danger',
                  })
              })
          }}>
            <FontAwesome name={'phone'} size={scale(28)} color={color.white}/>
          </Pressable>
        </View>
      </View>}
    </View>
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
    padding: scale(20),
    left: widthPercentageToDP(5),
    right: widthPercentageToDP(5),
    bottom: heightPercentageToDP(2),
    height: heightPercentageToDP(12),
    borderRadius: scale(10),
    backgroundColor: color.white,
  },
  driverContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(10),
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: wp(3),
  },
  phone: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default OrderOnMap;
