import DriverHeader from "components/DriverHeader"
import moment from "moment"
import React, {useEffect, useState} from "react"
import {ActivityIndicator, Image, Linking, Pressable, StyleSheet, View} from "react-native"
import Entypo from "react-native-vector-icons/Entypo";
import {useDispatch, useSelector} from "react-redux"
import {color, scale} from "utils"
import BaseScreen from "../../../components/BaseScreen"
import {CustomTextInput} from "../../../components/CustomTextInput"
import {Text} from "../../../components/text"
import {getDeliveredOrders} from "../../../screenRedux/driverRedux"
import {Images} from "../../../theme"

const History = ({navigation}) => {
  const {user: {id, name, driver: driver}} = useSelector((state) => state.loginReducer)
  const {loading, deliveredOrders} = useSelector((state) => state.driverReducer)
  const [filteredOrders, setFilteredOrders] = useState(deliveredOrders)
  const [ordersByDate, setOrdersByDate] = useState({})
  const [searchText, setSearchText] = useState('')
  const dispatch = useDispatch()


  const fetchHistory = () => {
    // fetch history
    dispatch(getDeliveredOrders({driverId: id}))
  }

  // event handlers
  useEffect(() => {
    // search
    const filtered = deliveredOrders.filter((item) => {
      const {address, restaurant, user: {name, customer: {phone, addresses}}} = item
      const deliveryAddress = addresses?.find(add => add.id === address)

      console.log('item', item)
      const keyword = searchText.toLowerCase()
      return restaurant?.name?.toLowerCase().includes(keyword)
        || restaurant?.description?.toLowerCase().includes(keyword)
        || restaurant?.type?.toLowerCase().includes(keyword)
        || restaurant?.ein_number?.includes(keyword)
        || restaurant?.phone?.includes(keyword)
        || restaurant?.street?.toLowerCase().includes(keyword)
        || restaurant?.city?.toLowerCase().includes(keyword)
        || restaurant?.state?.toLowerCase().includes(keyword)
        || restaurant?.zip_code?.toLowerCase().includes(keyword)
        || name?.toLowerCase().includes(keyword)
        || deliveryAddress?.street?.toLowerCase().includes(keyword)
        || deliveryAddress?.city?.toLowerCase().includes(keyword)
        || deliveryAddress?.state?.toLowerCase().includes(keyword)
        || deliveryAddress?.zip_code?.toLowerCase().includes(keyword)
    }).sort((a, b) => {
      return a.updated_at > b.updated_at ? -1 : 1
    })
    setFilteredOrders(filtered)
  }, [searchText, deliveredOrders])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory()
    });

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    let temp = {}
    filteredOrders.forEach((item) => {
      const date = moment(item.updated_at).format('dddd D/MM/YY')
      if (temp[date]) {
        temp[date].push(item)
      } else {
        temp[date] = [item]
      }
    })

    setOrdersByDate(temp)
  }, [filteredOrders])

  const renderData = () => {
    return Object.keys(ordersByDate).map(key => {
      return <View key={key} style={{marginVertical: scale(5)}}>
        <View style={{marginHorizontal: scale(20)}}>
          <Text variant={'h5'} fontSize={14}>{key}</Text>
        </View>
        {ordersByDate[key].map((order, idx) => {
          const {id, address, fees, tip, sub_total, status, total, restaurant, user} = order
          const deliveryAddress = user?.customer?.addresses?.find(add => add.id === address) || {}

          return (<View style={styles.orderContainer} key={idx}>
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
                <Text fontSize={12} variant={'strong'}>{restaurant.name} {order.updated_at}</Text>
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
            <View style={styles.price}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text fontSize={12} variant={'strong'}>${sub_total}</Text>
                <Text fontSize={12} variant={'strong'} style={styles.label}>Price</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text fontSize={12}>${fees}</Text>
                <Text fontSize={12} variant={'strong'} style={styles.label}>Fees</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text fontSize={12}>+${tip}</Text>
                <Text fontSize={12} variant={'strong'} style={styles.label}>Tip</Text>
              </View>
              <View style={styles.spliter}/>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text fontSize={12} variant={'strong'} color={'primary'}>${total}</Text>
                <Text fontSize={12} variant={'strong'} color={'primary'} style={styles.label}>Total</Text>
              </View>
            </View>
          </View>)
        })}
      </View>
    })
  }

  return (<BaseScreen style={styles.mainWrapper}>
    <DriverHeader photo={driver?.photo} name={name}/>
    <View style={{marginHorizontal: scale(20)}}>
      <CustomTextInput
        isImages={true}
        value={searchText}
        placeholder="Search trips"
        onChangeText={(text) => setSearchText(text)}
      />
    </View>
    <View style={styles.container}>
      {loading ?
        <ActivityIndicator/>
        : renderData()
      }
    </View>
  </BaseScreen>)
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white},
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    marginVertical: 5,
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowColor: color.lightGray,
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
  images: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: scale(10),
    width: scale(40)
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
    width: scale(70),
  },
  spliter: {
    height: 1,
    marginHorizontal: '0%',
    width: '100%',
    backgroundColor: color.black,
    marginVertical: scale(5)
  },
  label: {
    width: '40%',
    marginLeft: scale(5)
  }
})

export default History;
