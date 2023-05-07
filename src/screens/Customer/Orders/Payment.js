import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import FontAwesomeIcons from 'react-native-vector-icons/dist/FontAwesome';
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Button, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {createNewOrder, createNewOrderAPI, getPaymentsRequest, payOrderAPI, payOrderRequest} from "../../../screenRedux/customerRedux";
import {Images} from "../../../theme";

const Payment = ({route}) => {
  const dispatch = useDispatch()
  const {addresses, payments, loading} = useSelector(state => state.customerReducer);
  const defaultAddress = addresses?.find(o => o.default)
  const [paymentId, setPaymentId] = React.useState(null)

  const order = route?.params?.order

  // console.log('order', order)

  const pay = async (orderId) => {
    dispatch(payOrderRequest({
      payment_method: paymentId,
      order: order.id
    }))
  }

  const renderFinalTotal = () => {
    return order.total
  }

  useEffect(() => {
    dispatch(getPaymentsRequest())
  }, [])

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Payment"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.pricingView}>
            <Text variant="text" color="black" fontSize={14} fontWeight="400">Total</Text>
            <Text variant="text" color="black" fontSize={14} fontWeight="400">${renderFinalTotal()}</Text>
          </View>
          <View style={styles.innerContain}>
            {payments?.map((payment, index) => {
              return (
                <Pressable onPress={() => setPaymentId(payment.id)} key={'payment-' + index}>
                  {paymentId === payment.id && <View style={styles.circle}>
                    <Image source={Images.ticks} style={styles.tickImg}/>
                  </View>}
                  <View style={[styles.itemContain, paymentId === payment.id && styles.activeItem]} key={index.toString()}>
                    <Text variant="text" color="black" fontSize={16} fontWeight="700">{payment.card.brand}</Text>
                    <View style={[styles.flexDirection, styles.paddingTop]}>
                      <FontAwesomeIcons name="cc-mastercard" size={16} color={color.black} style={{marginRight: scaleVertical(10)}}/>
                      <Text variant="text" color="black" fontSize={16} fontWeight="400">************* {payment.card.last4}</Text>
                    </View>
                  </View>
                </Pressable>
              )
            })}
            <Button
              style={styles.btnStyle}
              variant="outline"
              text="Add New Payment Method"
              textColor="black"
              onPress={() => navigate("AddCard")}
              fontSize={16}
              fontWeight="600"
              icon="add"
            />
          </View>
        </ScrollView>
        {paymentId && <Button loading={loading} text="Pay" fontSize={18} fontWeight={'600'} mt={20} onPress={pay}/>}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: scaleVertical(25),
  },
  flexDirection: {
    flexDirection: "row",
  },
  paddingTop: {
    paddingTop: scaleVertical(5),
  },
  innerContain: {
    marginBottom: 25,
    backgroundColor: color.white,
    padding: scaleVertical(10)
  },
  itemContain: {
    backgroundColor: color.secondary,
    borderRadius: scale(10),
    borderColor: color.black,
    borderWidth: scale(1),
    marginBottom: scale(15),
    padding: scale(10),
    justifyContent: 'center',
  },
  activeItem: {
    borderColor: color.primary,
  },
  checkView: {
    position: 'absolute',
    right: -4,
    top: -4,
    zIndex: 12,
  },
  pricingView: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: scaleVertical(3),
  },
  btnStyle: {
    borderColor: color.black,
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

export default Payment;
