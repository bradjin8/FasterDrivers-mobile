import {Text} from "components/text";
import React from 'react'
import {Image, Pressable, StyleSheet, View} from "react-native";
import FontAwesomeIcons from "react-native-vector-icons/dist/FontAwesome";
import {Images} from "../theme";
import {BG, Border, Flex, Margin, Padding} from "../theme/Styles";
import {color, scale, scaleVertical} from "../utils"

const PaymentCard = (props) => {
  const {payment, active, onPress} = props

  return (<Pressable onPress={() => onPress?.(payment.id)}>
    {active && <View style={styles.circle}>
      <Image source={Images.ticks} style={styles.tickImg}/>
    </View>}
    <View style={[
      Flex.justifyCenter,
      BG.secondary,
      Border.black, Border.round10, Border.w2,
      Padding.v10, Padding.h10,
      Margin.b10,
      active && Border.primary
    ]}>
      <Text variant="text" color="black" fontSize={16} fontWeight="700">{payment.card.brand}</Text>
      <View style={[Flex.row, Padding.t5]}>
        <FontAwesomeIcons name="cc-mastercard" size={16} color={color.black} style={{marginRight: scaleVertical(10)}}/>
        <Text variant="text" color="black" fontSize={16} fontWeight="400">************* {payment.card.last4}</Text>
      </View>
    </View>
  </Pressable>)
}

export default PaymentCard

const styles = StyleSheet.create({
  flexDirection: {
    flexDirection: "row",
  },
  paddingTop: {
    paddingTop: scaleVertical(5),
  },
  circle: {
    position: 'absolute',
    right: -10,
    top: -8,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickImg: {height: 24, width: 24, borderRadius: 12},
})
