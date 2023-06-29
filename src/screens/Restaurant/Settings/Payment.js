import PaymentCard from "components/PaymentCard";
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scaleVertical} from "utils";
import {Button, Text} from "src/components/index";
import SimpleHeader from "src/components/SimpleHeader";
import {deletePaymentRequest, getPaymentsRequest, payOrderRequest} from "src/screenRedux/customerRedux";
import {Flex} from "src/theme/Styles";

const Payment = ({route}) => {
  const dispatch = useDispatch()
  const {payments, loading} = useSelector(state => state.customerReducer);
  const [paymentId, setPaymentId] = React.useState(null)

  const subscription = route?.params?.subscription

  // console.log('order', order)

  const pay = async () => {
    let data = new FormData()
    data.append('payment_method', paymentId)
    data.append('order', subscription.id)
    dispatch(payOrderRequest(data))
  }

  const removePaymentMethod = () => {
    Alert.alert('Are you sure to remove this payment method?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          const data = new FormData()
          data.append('payment_method', paymentId)
          dispatch(deletePaymentRequest(data))
        }
      }
    ])
  }

  const renderFinalTotal = () => {
    return subscription.amount / 100
  }

  useEffect(() => {
    dispatch(getPaymentsRequest())
  }, [])

  useEffect(() => {
    setPaymentId(null)
  }, [payments])

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Payment"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.pricingView}>
            <Text variant="strong" color="black" fontSize={14} fontWeight="400">Total</Text>
            <Text variant="strong" color="black" fontSize={14} fontWeight="400">${renderFinalTotal()}</Text>
          </View>
          <View style={styles.innerContain}>
            {payments?.map((payment, index) => <PaymentCard payment={payment} key={index} onPress={() => setPaymentId(payment.id)} active={paymentId === payment.id}/>)}
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
        {paymentId && <View style={[Flex.row, Flex.justifyBetween]}>
          <Button loading={loading} text="Remove" fontSize={18} fontWeight={'600'} mt={20} onPress={removePaymentMethod} width={widthPercentageToDP(40)} style={{backgroundColor: 'red'}}/>
          <Button loading={loading} text="Pay" fontSize={18} fontWeight={'600'} mt={20} onPress={pay} width={widthPercentageToDP(40)}/>
        </View>}
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
