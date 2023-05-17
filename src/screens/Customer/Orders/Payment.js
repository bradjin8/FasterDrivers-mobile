import PaymentCard from "components/PaymentCard";
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import FontAwesomeIcons from 'react-native-vector-icons/dist/FontAwesome';
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Button, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {getPaymentsRequest, payOrderRequest} from "../../../screenRedux/customerRedux";
import {Images} from "../../../theme";

const Payment = ({route}) => {
  const dispatch = useDispatch()
  const {payments, loading} = useSelector(state => state.customerReducer);
  const [paymentId, setPaymentId] = React.useState(null)

  const order = route?.params?.order

  // console.log('order', order)

  const pay = async () => {
    let data = new FormData()
    data.append('payment_method', paymentId)
    data.append('order', order.id)
    dispatch(payOrderRequest(data))
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
            {payments?.map((payment, index) => <PaymentCard payment={payment} key={index} onPress={() => setPaymentId(payment.id)} active={paymentId === payment.id}/> )}
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
})

export default Payment;
