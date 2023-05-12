import React from "react";
import {Text} from "components/text";
import {View, StyleSheet, Image} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {ORDER_STATUS} from "../consts/orders";
import {Images} from "../theme";
import {color} from "../utils/color";

const OrderStatusIndicator = ({status}) => {
  let idx = -1
  switch (status) {
    case ORDER_STATUS.DriverAssigned:
    case ORDER_STATUS.InProgress:
    case ORDER_STATUS.InTransit:
      idx = 1
      break;
    case ORDER_STATUS.Accepted:
    // case 'pending':
      idx = 0
      break;
    case ORDER_STATUS.Delivered:
      idx = 2
      break;
    default:
      idx = -1
  }

  if (status === ORDER_STATUS.Unpaid) {
    return (<View/>)
  }

  if (status === ORDER_STATUS.Rejected) {
    return (<View style={styles.container}>
      <View style={styles.item}>
        <View style={{...styles.iconContainer, ...{
            backgroundColor: color.error,
            borderColor: color.black,
          }}}>
          <Image source={Images.OrderRejected} style={styles.icon} />
        </View>
        <Text variant="strong" color="item" fontSize={12} fontWeight="400" style={{ marginTop: hp(1) }}>
          Order  Declined
        </Text>
      </View>
    </View>)
  }

  return <View style={styles.container}>
    {ORDER_INDICATORS.map((item, index) => {
        return (
          <View key={index} style={styles.item}>
            <View style={{...styles.iconContainer, ...{
              backgroundColor: idx >= index ? color.primary : color.white,
              borderColor: idx >= index ? color.primary : color.black,
            }}}>
              <Image source={item.icon} style={styles.icon} />
            </View>
            <Text variant="strong" color="item" fontSize={12} fontWeight="400" style={{ marginTop: hp(1) }}>
              {item.title}
            </Text>
          </View>
        )
      })}
    <View style={styles.cross}/>
  </View>
}

export default OrderStatusIndicator

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    width: wp(100),
    height: hp(10),
    justifyContent: 'space-evenly',
    marginVertical: hp(1),
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 26,
    resizeMode: 'contain',
  },
  cross: {
    position: 'absolute',
    zIndex: -10,
    left: wp(20),
    right: wp(20),
    top: hp(1),
    height: 1,
    backgroundColor: color.lightGray,
    alignSelf: 'center',
    marginTop: hp(2)
  }
})

const ORDER_INDICATORS = [
  {
    title: 'Accepted',
    icon: Images.OrderAccepted,
  },
  {
    title: 'In Progress',
    icon: Images.OrderInProgress,
  },
  {
    title: 'Delivered',
    icon: Images.OrderDelivered,
  },
]
