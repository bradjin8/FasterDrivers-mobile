import DriverCard from "components/DriverCard";
import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Pressable, ActivityIndicator} from 'react-native';
import {widthPercentageToDP} from "react-native-responsive-screen";
import Octicons from "react-native-vector-icons/Octicons";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {truncateString} from "utils/utils";
import {Text} from "../components/index";
import {ORDER_STATUS, ORDER_STATUS_COLOR} from "../consts/orders";
import {acceptOrderRequest, getDishAPI, rejectOrderRequest} from "../screenRedux/restaurantRedux";
import moment from "moment";
import {Flex} from "../theme/Styles";

const OrderByCustomer = ({order, tab}) => {
  const [expanded, setExpanded] = useState(false)
  const {loading} = useSelector(state => state.restaurantReducer)
  const dispatch = useDispatch()

  const acceptOrder = () => {
    if (!loading) {
      dispatch(acceptOrderRequest(order.id))
    }
  }

  const rejectOrder = () => {
    if (!loading) {
      dispatch(rejectOrderRequest(order.id))
    }
  }

  const assignDriver = () => {
    navigate('Map', {
      screen: 'Map',
      params: {orderId: order.id}
    })
  }

  const renderAction = () => {
    switch (order.status) {
      case ORDER_STATUS.Pending:
        return (
          <View style={styles.rowEvenly}>
            <Pressable style={styles.decline} onPress={rejectOrder}>
              <Text color='white' variant='strong'>Decline</Text>
            </Pressable>
            <Pressable style={styles.accept} onPress={acceptOrder}>
              <Text color='white' variant='strong'>Accept</Text>
            </Pressable>
          </View>
        )
      case ORDER_STATUS.Accepted:
        return (
          <View style={styles.rowCenter}>
            <Pressable style={styles.assign} onPress={assignDriver}>
              <Text color='white' variant='strong'>Assign to Driver</Text>
            </Pressable>
          </View>
        )
      case ORDER_STATUS.DriverAssigned:
        return (
          <View style={{padding: scale(20)}}>
            <DriverCard driver={order.driver} />
          </View>
        )
      default:

    }

    return <View></View>
  }

  // console.log('order-detail', data)
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.avatar}>
          <Image source={{uri: order.user.customer?.photo}} style={styles.avatar}/>
        </View>
        <View style={styles.itemBody}>
          <View style={styles.row}>
            <Text color='item' variant='h5' fontSize={14}>{order.user.name || `${order.user.first_name} ${order.user.last_name}`}</Text>
            {/*{renderOrderStatus()}*/}
            <Text color={ORDER_STATUS_COLOR[order.status]}>{order.status}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'}>{order.dishes.length} dish{order.dishes.length > 1 ? 'es' : ''}</Text>
            <Text color='darkGray' fontSize={12}>{moment.utc(order.updated_at).fromNow()}</Text>
          </View>
        </View>
        <Pressable style={styles.itemNext} onPress={() => setExpanded(!expanded)}>
          <Octicons name={expanded ? 'chevron-down' : 'chevron-right'} size={20} color={color.black}/>
        </Pressable>
      </View>
      {expanded === true && <View style={styles.detailContainer}>
        {order.dishes.map((item, index) => <DishDetail key={index} data={item}/>)}
        <View style={styles.priceContainer}>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Price</Text>
            <Text color='item' variant='h5' fontSize={14}>${order.sub_total}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Fee</Text>
            <Text color='item' variant='h5' fontSize={14}>${order.fees}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Tip</Text>
            <Text color='item' variant='h5' fontSize={14}>${order.tip}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Total Price</Text>
            <Text color='item' variant='h5' fontSize={14}>${order.total}</Text>
          </View>
        </View>
        {renderAction()}
      </View>}
    </View>
  )
}

export default OrderByCustomer;

const DishDetail = ({data}) => {
  const [loading, setLoading] = useState(false)
  const [dish, setDish] = useState({
    name: 'Unknown Dish',
    description: '',
  })

  useEffect(() => {
    setLoading(true)
    getDishAPI(data.dish)
      .then(res => {
        // console.log(res.data)
        setDish(res.data)
        setLoading(false)
      })
      .catch(err => {
        // console.log(err)
        setLoading(false)
      })
  }, [])

  if (loading)
    return <ActivityIndicator/>

  return (
    <View style={styles.dishContainer}>
      <View style={styles.dishBody}>
        <Image source={{uri: dish.image_1}} style={styles.photo}/>
        <View>
          <View style={[Flex.row, Flex.itemsCenter]}>
            {data?.quantity > 1 && <Text color={'primary'} fontWeight={'400'} variant={'h5'} fontSize={12}>{data.quantity}x</Text>}
            <Text style={{marginLeft: 5}}>{dish.name}</Text>
          </View>
          <Text color={'darkGray'} variant={'hint'}>{truncateString(dish.description, 50)}</Text>
        </View>
      </View>
      <View>
        <Text color='item' variant='h5' fontSize={14}>${dish.price}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    marginVertical: scaleVertical(5),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowColor: color.lightGray,
  },
  item: {
    marginVertical: scale(10),
    width: widthPercentageToDP(100),
    backgroundColor: color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    resizeMode: 'cover',
    backgroundColor: color.lightGray,
  },
  itemBody: {
    width: widthPercentageToDP(65),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemNext: {
    width: widthPercentageToDP(6),
  },
  detailContainer: {
    width: widthPercentageToDP(100),
    paddingVertical: 10,
  },
  dishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingRight: widthPercentageToDP(4),
    alignItems: 'center'
  },
  dishBody: {
    flexDirection: 'row',
    width: widthPercentageToDP(70),
    alignItems: 'center',
  },
  photo: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'cover',
    marginRight: widthPercentageToDP(2)
  },
  priceContainer: {
    padding: scale(15),
  },
  rowEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  decline: {
    backgroundColor: color.error,
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(80),
    borderRadius: scale(15)
  },
  accept: {
    backgroundColor: color.info,
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(80),
    borderRadius: scale(15)
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assign: {
    backgroundColor: color.primary,
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(80),
    borderRadius: scale(15)
  }
})
