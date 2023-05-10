import SimpleHeader from "components/SimpleHeader";
import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {widthPercentageToDP} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {extractLatLong} from "utils/Location";
import {Text} from "../../../components/text"
import {assignDriverRequest, getNearByDriversRequest} from "../../../screenRedux/restaurantRedux";

const Map = ({route}) => {
  const {user: {restaurant: restaurant}} = useSelector(state => state.loginReducer)
  const {loading, nearbyDrivers} = useSelector(state => state.restaurantReducer)
  const {orderId} = route.params || {}

  const [resPoint, setResPoint] = useState(null)
  const [activeDriverIndex, setActiveDriverIndex] = useState(-1)


  const dispatch = useDispatch()
  const data = mockData

  console.log('restaurant', nearbyDrivers, orderId)

  const assignDriver = (driverId) => {
    if (orderId) {
      const formData = new FormData()
      formData.append('driver', driverId)
      formData.append('order', orderId)
      dispatch(assignDriverRequest(
        formData,
        () => {
          navigate('Home', {
            screen: 'Home',
            params: {
              tab: 1,
            }
          })
        }
      ))
    }
  }

  useEffect(() => {
    if (restaurant?.location?.includes("POINT")) {
      const point = extractLatLong(restaurant.location)
      console.log('point', point)
      setResPoint(point)
    }
  }, [restaurant?.location])

  useEffect(() => {
    dispatch(getNearByDriversRequest())
  }, [])

  const renderOverlay = () => {
    if (activeDriverIndex < 0)
      return <View></View>

    const {name, driver: driver} = data[activeDriverIndex]
    return (<View style={styles.overlay}>
      <View style={styles.overlayRow}>
        <View style={styles.avatar}>
          <Image source={{uri: `${driver?.photo}`}} style={styles.avatar} resizeMode={'cover'}/>
        </View>
        <View style={styles.overlayColumn}>
          <Text color={'gray'}>Courier</Text>
          <Text variant={'strong'} fontSize={14} color={'item'}>{name}</Text>
        </View>
        <View style={styles.overlayColumn}>
          <Text variant='strong' color={'item'} fontSize={14}>1.7 Miles</Text>
          <Text color={'gray'}>15 Minutes Away</Text>
        </View>
      </View>
      <Pressable style={styles.assign} onPress={() => assignDriver(driver.id)}>
        <Text fontSize={16} variant={'strong'} color={'white'}>Assign</Text>
      </Pressable>
    </View>)
  }

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <SimpleHeader
        title="Map"
        showBackIcon={true}
      />
      {resPoint && <MapView
        style={styles.container}
        initialRegion={{
          latitude: resPoint.latitude,
          longitude: resPoint.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Marker
          coordinate={resPoint}
          onPress={() => setActiveDriverIndex(-1)}
        >
          <View style={styles.marker}>
            <MaterialIcons name="restaurant" size={26} color={color.white}/>
          </View>
        </Marker>
        {data.map((item, index) => {
          const point = extractLatLong(item.driver.location);
          const active = index === activeDriverIndex
          return (
            <Marker
              key={index}
              coordinate={point}
              onPress={() => {
                setActiveDriverIndex(activeDriverIndex === index ? -1 : index)
              }}
            >
              <View style={{...styles.driver, backgroundColor: active ? color.primary : color.white}}>
                <View
                  style={{
                    ...styles.driverMarker,
                    borderColor: active ? color.white : color.primary,
                    backgroundColor: active ? color.primary : color.white,
                  }}
                >
                  <Ionicons name="bicycle" size={26} color={active ? color.white : color.item}/>
                </View>
                <Text color={active ? 'white' : 'item'} variant={'strong'} fontSize={12}>{item.name.split(' ')[0]}</Text>
              </View>
            </Marker>
          )
        })}
        {renderOverlay()}
      </MapView>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {
    flex: 1,
    backgroundColor: color.error,
    padding: scaleVertical(25),
    position: 'relative',
  },
  marker: {
    width: scale(40),
    height: scale(40),
    backgroundColor: color.primary,
    borderRadius: scale(17),
    justifyContent: 'center',
    alignItems: 'center',
  },
  driver: {
    width: scale(94),
    height: scale(36),
    borderRadius: scale(18),
    borderWidth: 2,
    borderColor: color.primary,
    justifyContent: 'center',
    paddingLeft: scale(40),
  },
  driverMarker: {
    width: scale(36),
    height: scale(36),
    backgroundColor: color.white,
    borderRadius: scale(18),
    borderColor: color.primary,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -2,
    top: -2
  },
  overlay: {
    position: 'absolute',
    height: scaleVertical(144),
    backgroundColor: color.white,
    borderRadius: scale(10),
    left: widthPercentageToDP(5),
    right: widthPercentageToDP(5),
    bottom: scale(20),
    alignItems: 'center',
    paddingHorizontal: scale(10),
    justifyContent: 'space-around'
  },
  avatar: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    backgroundColor: color.gray,
  },
  overlayRow: {
    width: '100%',
    flexDirection: 'row',
  },
  overlayColumn: {
    width: widthPercentageToDP(35),
    marginLeft: scale(10),
    height: scale(54),
    justifyContent: 'space-evenly'
  },
  assign: {
    width: scale(80),
    height: scale(40),
    backgroundColor: color.primary,
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Map;

const mockData = [
  {
    "id": "790e70ef-4321-4ce1-bb52-8f8643a42b82",
    "name": "Mike Jones",
    "first_name": "Mike",
    "last_name": "Jones",
    "email": "sallar.rezaie+driver@crowdbotics.com",
    "is_admin": false,
    "type": "Driver",
    "customer": null,
    "driver": {
      "id": "d964df5c-d92d-42be-91f5-e784602fe7bb",
      "created_at": "2023-04-25 11:55:18",
      "updated_at": "2023-04-25 12:16:36",
      "photo": "data:image/jpeg;base64,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",
      "phone": "4169282039",
      "street": "25 Rodeo Dr",
      "city": "Beverly Hills",
      "state": "California",
      "zip_code": "90212",
      "location": "SRID=4326;POINT (-73.9731866 40.7185526)",
      "car_make": "Honda",
      "car_model": "Civic",
      "car_vin": "591AND8DNSL2",
      "car_license_number": "BWUC392",
      "user": "790e70ef-4321-4ce1-bb52-8f8643a42b82"
    },
    "restaurant": null
  },
  {
    "id": "790e70ef-4321-4ce1-bb52-8f8643a42b82",
    "name": "Calos Puyol",
    "first_name": "Mike",
    "last_name": "Jones",
    "email": "sallar.rezaie+driver@crowdbotics.com",
    "is_admin": false,
    "type": "Driver",
    "customer": null,
    "driver": {
      "id": "d964df5c-d92d-42be-91f5-e784602fe7bb",
      "created_at": "2023-04-25 11:55:18",
      "updated_at": "2023-04-25 12:16:36",
      "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZTzGiJbNFynp8il1Kr5wx92R_4TJNBP_j-GJoFsdMWsGVBunzTm9xQLtQGAcFUMFPJ3Y&usqp=CAU",
      "phone": "4169282039",
      "street": "25 Rodeo Dr",
      "city": "Beverly Hills",
      "state": "California",
      "zip_code": "90212",
      "location": "SRID=4326;POINT (-73.9811366 40.7685526)",
      "car_make": "Honda",
      "car_model": "Civic",
      "car_vin": "591AND8DNSL2",
      "car_license_number": "BWUC392",
      "user": "790e70ef-4321-4ce1-bb52-8f8643a42b82"
    },
    "restaurant": null
  }
]
