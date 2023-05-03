import React from "react";
import {Text} from "components/text";
import {View, StyleSheet, Image} from "react-native";
import {colors} from "react-native-elements";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Images} from "../theme";

const OrderStatusIndicator = ({status}) => {
  let idx = -1
  switch (status.toLowerCase()) {
    case 'pending':
    case 'in progress':
    case 'in transit':
      idx = 1
      break;
    case 'accepted':
      idx = 0
      break;
    case 'delivered':
      idx = 2
      break;
    default:
      idx = -1
  }
  return <View style={styles.container}>
    {ORDER_INDICATORS.map((item, index) => {
        return (
          <View key={index} style={styles.item}>
            <View style={{...styles.iconContainer, ...{
              backgroundColor: idx === index ? colors.primary : colors.white,
              borderColor: idx === index ? colors.primary : colors.black,
            }}}>
              <Image source={item.icon} style={styles.icon} />
            </View>
            <Text variant="text" color="item" fontSize={12} fontWeight="400" style={{ marginTop: hp(1) }}>
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
    backgroundColor: colors.grey4,
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
