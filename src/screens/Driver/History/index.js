import DriverHeader from "components/DriverHeader"
import moment from "moment"
import React, {useEffect, useState} from "react"
import {ActivityIndicator, FlatList, Image, Linking, Pressable, SafeAreaView, StyleSheet, View} from "react-native"
import Entypo from "react-native-vector-icons/Entypo";
import {useDispatch, useSelector} from "react-redux"
import {color, scale} from "utils"
import BaseScreen from "../../../components/BaseScreen"
import {CustomTextInput} from "../../../components/CustomTextInput"
import {Text} from "../../../components/text"
import {getDeliveredOrders} from "../../../screenRedux/driverRedux"
import {Images} from "../../../theme"
import {Flex, Margin} from "../../../theme/Styles";

const History = ({navigation}) => {
  const {user: {id, name, driver: driver}} = useSelector((state) => state.loginReducer)
  const {deliveredOrders} = useSelector((state) => state.driverReducer)
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

  const renderItem = ({item: key, index, separators}) => {
    return <View style={{marginVertical: scale(5)}}>
      <View style={{marginHorizontal: scale(20)}}>
        <Text variant={'h5'} fontSize={14}>{key}</Text>
      </View>
      {ordersByDate[key].map((order, idx) => {
        const {id, address, fees, tip, sub_total, status, total, restaurant, user} = order
        const deliveryAddress = user?.customer?.addresses?.find(add => add.id === address) || {}

        return (<View style={styles.orderContainer} key={idx}>
          <View style={styles.info}>
            <Image source={Images.VertLineDot} style={styles.line} resizeMode={'contain'}/>
            <View style={[Flex.row, Flex.justifyStart, Flex.itemsCenter]}>
              <View style={styles.marker}>
                <Image source={Images.Market} style={{width: 20, height: 20}} resizeMode={'contain'}/>
              </View>
              <View style={styles.restaurant}>
                <Text fontSize={12} variant={'strong'}>{restaurant.name} {order.updated_at}</Text>
                <Text fontSize={12}>{restaurant.street}</Text>
                <Text fontSize={12}>{restaurant.city}, {restaurant.state} {restaurant.zip_code}</Text>
              </View>
            </View>
            <View style={[Flex.row, Flex.justifyStart, Flex.itemsCenter]}>
              <View style={styles.marker}>
                <Entypo name={'location-pin'} size={20}/>
              </View>
              <View style={styles.restaurant}>
                <Text fontSize={12} variant={'strong'}>{user?.name}</Text>
                <Text fontSize={12}>{deliveryAddress.street}</Text>
                <Text fontSize={12}>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip_code}</Text>
              </View>
            </View>
          </View>
          <View style={styles.price}>
            <View style={[Flex.row, Flex.itemsCenter, Flex.justifyEnd]}>
              <Text fontSize={12} variant={''}>${sub_total}</Text>
              <Text fontSize={12} variant={''} style={styles.label}>Price</Text>
            </View>
            <View style={[Flex.row, Flex.itemsCenter, Flex.justifyEnd]}>
              <Text fontSize={12}>${fees}</Text>
              <Text fontSize={12} variant={''} style={styles.label}>Fees</Text>
            </View>
            <View style={[Flex.row, Flex.itemsCenter, Flex.justifyEnd]}>
              <Text fontSize={12}>+${tip}</Text>
              <Text fontSize={12} variant={''} style={styles.label}>Tip</Text>
            </View>
            <View style={styles.spliter}/>
            <View style={[Flex.row, Flex.itemsCenter, Flex.justifyEnd, Margin.t10]}>
              <Text fontSize={12} variant={'strong'} color={'primary'}>${total}</Text>
              <Text fontSize={12} variant={'strong'} color={'primary'} style={styles.label}>Total</Text>
            </View>
          </View>
        </View>)
      })}
    </View>
  }

  return (<SafeAreaView style={styles.mainWrapper}>
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
      <FlatList
        data={Object.keys(ordersByDate)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No orders</Text>}
        refreshing={false}
        onRefresh={fetchHistory}
      />
    </View>
  </SafeAreaView>)
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
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  images: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: scale(10),
    width: scale(40)
  },
  info: {
    position: 'relative',
    justifyContent: 'space-between',
    paddingVertical: 10,
    height: 130,
  },
  line: {
    position: 'absolute',
    width: 2,
    height: 52,
    left: 16,
    top: 40,
    resizeMode: 'contain',
    zIndex: -1
  },
  restaurant: {
    height: scale(34),
    justifyContent: 'space-evenly',
  },
  price: {
    width: 100,
    justifyContent: 'center',
  },
  spliter: {
    height: 1,
    width: '50%',
    marginHorizontal: '25%',
    backgroundColor: color.black,
    marginVertical: scale(5)
  },
  label: {
    width: '40%',
    marginLeft: scale(5)
  }
})

export default History;
