import React, {useEffect, useState} from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {color, scale, scaleVertical} from "utils";
import {Images} from "src/theme";
import {ActivityIndicators, Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import {useDispatch, useSelector} from "react-redux";
import {navigate} from "navigation/NavigationService";
import {getMyOrders} from "../../../screenRedux/customerRedux";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import moment from 'moment'

const Orders = () => {
  const dispatch = useDispatch();
  const {loading, orders} = useSelector(state => state.customerReducer);
  const {user, accessToken} = useSelector(state => state.loginReducer);

  console.log('user', user.id, accessToken)
  console.log('orders', orders)

  useEffect(() => {
    dispatch(getMyOrders({
      user: user.id,
      status: [
      ]
    }))
  }, []);

  if (loading) {
    return (<ActivityIndicators/>)
  }

  const onPressOrder = (item) => {
    navigate('OrderDetails', {order: item})
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'unpaid':
        return 'red'
      case 'pending':
      case 'in progress':
      case 'in transit':
        return 'orange'
      case 'accepted':
        return 'green'
      case 'rejected':
        return 'red'
      case 'delivered':
        return 'blue'
      case 'cancelled':
        return 'red'
      default:
        return 'black'
    }
  }

  const renderOrders = () => {
    return <View style={styles.items}>
      {orders.map((item, index) => {
        return <View style={styles.orderContainer} key={index}>
          <Image source={{uri: item.restaurant.photo}} style={styles.resIcon}/>
          <View style={styles.details}>
            <View style={styles.detailsRow}>
              <Text style={styles.title}>{item.restaurant.name}</Text>
              <Pressable onPress={() => onPressOrder(item)}>
                <Image source={Images.Next} style={styles.goIcon}/>
              </Pressable>
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
        </View>
      })}
    </View>
  }

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="My Orders"
        showBackIcon={true}
      />
      <ScrollView style={styles.container}>
        {renderOrders()}
      </ScrollView>
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
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
  },
  resIcon: {
    width: wp(25),
    height: wp(20),
    marginRight: scale(10),
    borderRadius: wp(2)
  },
  goIcon: {
    width: wp(5),
    height: wp(5),
    marginLeft: scale(10),
    resizeMode: 'contain',
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
