import SimpleHeader from "components/SimpleHeader";
import moment from 'moment'
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {FlatList, Image, Pressable, StyleSheet, View} from "react-native";
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Octicons from "react-native-vector-icons/Octicons";
import {useDispatch, useSelector} from "react-redux";
import {color, scale} from "utils";
import {Text} from "../../../components/index";
import {ORDER_STATUS} from "../../../consts/orders";
import {getMyOrders} from "../../../screenRedux/customerRedux";

const Orders = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, orders} = useSelector(state => state.customerReducer);
  const {user, accessToken} = useSelector(state => state.loginReducer);

  // console.log('user', user.id, accessToken)
  console.log('orders', orders)

  const fetchOrders = () => {
    dispatch(getMyOrders({
      user: user.id,
      status: []
    }))
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders()
    })
    // fetchOrders()
    return unsubscribe
  }, []);

  const onPressOrder = (item) => {
    navigate('OrderDetails', {order: item})
  }

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.Unpaid:
      case ORDER_STATUS.Rejected:
        return 'red'
      case ORDER_STATUS.DriverAssigned:
        return 'cyan'
      case ORDER_STATUS.Pending:
      case ORDER_STATUS.InProgress:
      case ORDER_STATUS.InTransit:
        return 'orange'
      case ORDER_STATUS.Accepted:
        return 'green'
      case ORDER_STATUS.Delivered:
        return 'blue'
      default:
        return 'black'
    }
  }

  const renderItem = ({item, index}) => {
    return <Pressable style={styles.orderContainer} key={index} onPress={() => onPressOrder(item)}>
      <Image source={{uri: item.restaurant.photo}} style={styles.resIcon}/>
      <View style={styles.details}>
        <View style={styles.detailsRow}>
          <Text style={styles.title}>{item.restaurant.name}</Text>
          <View style={styles.goIcon}>
            <Octicons name={'chevron-right'} size={20} color={color.black}/>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.info}>{item.dishes.length} dish{item.dishes.length > 1 && 'es'}</Text>
          <Text style={styles.info}>Total price: $ {item.total}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.info}>Updated at {moment(item.updated_at).format('h:mm A, ddd')}</Text>
          <Text style={{...styles.info, ...{color: getStatusColor(item.status)}}}>{item.status}</Text>
        </View>
      </View>
    </Pressable>
  }

  const renderOrders = () => {
    return <FlatList
      data={(orders || []).sort((a, b) => a.updated_at < b.updated_at ? 1 : -1)}
      renderItem={renderItem}
      refreshing={loading}
      onRefresh={fetchOrders}
    />
  }

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="My Orders"
        showBackIcon={false}
      />
      {renderOrders()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {
    flex: 1, backgroundColor: color.white
  },
  items: {
    flexDirection: "row",
    width: wp(100),
  },
  orderContainer: {
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: wp(1),
    backgroundColor: color.white,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowColor: color.lightGray,
  },
  resIcon: {
    width: wp(25),
    height: wp(20),
    marginRight: scale(10),
    borderRadius: wp(2)
  },
  goIcon: {
    marginLeft: scale(10),
  },
  details: {
    width: wp(70),
    flexDirection: "column",
    justifyContent: "space-between",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: 'black',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  info: {
    color: 'black',
    fontSize: scale(12),
  }
});

export default Orders;
