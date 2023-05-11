import {CardField, useStripe} from "@stripe/stripe-react-native";
import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {useDispatch, useSelector} from "react-redux";
import {color, scaleVertical} from "utils";
import BaseScreen from "../../../components/BaseScreen";
import {Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {addPaymentRequest, getAddressesData} from "../../../screenRedux/customerRedux";

const AddCard = ({}) => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.loginReducer)
  const {addresses, loading} = useSelector(state => state.customerReducer)
  const [cardHolder, setCardHolder] = useState(user?.name)
  const [cardNumber, setCardNumber] = useState(null)
  const [cardDate, setCardDate] = useState(null)
  const [cvv, setCvv] = useState(null)
  const defaultAddress = addresses?.find(o => o.default) || addresses[0]

  const {createPaymentMethod} = useStripe();

  // console.log('defaultAddress', defaultAddress)
  const onBlurCard = () => {};

  const addCard = () => {
    if (!cardHolder) {
      showMessage({
        message: 'Please enter card holder name',
        type: 'danger',
      })
      return
    }
    createPaymentMethod({
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          name: cardHolder,
        }
      }
      // card: {
      //   number: cardNumber,
      //   expMonth: 11,
      //   expYear: 24,
      //   cvc: cvv,
      // },
    }).then((result) => {
      console.log('result', result);
      dispatch(addPaymentRequest({
        payment_method: result.paymentMethod.id,
        billing_details: {
          name: cardHolder,
          address: {
            city: defaultAddress?.city,
            country: defaultAddress?.country,
            line1: defaultAddress?.street,
            postal_code: defaultAddress?.zip_code,
            state: defaultAddress?.state,
          }
        },
      }))
    }).catch(e => {
      console.log('create-payment-error', e.message);
    })
  }

  useEffect(() => {
    dispatch(getAddressesData())
  }, [])

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Add Card"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{width: '100%',}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            CARD HOLDER NAME
          </Text>
          <CustomTextInput
            value={cardHolder}
            placeholder="Jeny Wilson"
            onChangeText={(text) => setCardHolder(text)}
            onBlurText={onBlurCard}
          />

          <Text variant="text" color="black" style={styles.inputTitle}>
            CARD DETAILS
          </Text>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: color.slightGray,
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginTop: 10,
              marginBottom: 30,
            }}
            onCardChange={(cardDetails) => {
              // console.log('cardDetails', cardDetails);
            }}
            onFocus={(focusedField) => {
              // console.log('focusField', focusedField);
            }}
          />
          {/*<Text variant="text" color="black" style={styles.inputTitle}>
            Card number
          </Text>
          <CustomTextInput
            value={cardNumber}
            placeholder="_ _ _ _  _ _ _ _  _ _ _ _  _ _ _ _"
            onChangeText={(text) => setCardNumber(text)}
            onBlurText={onBlurCard}
          />

          <View style={styles.flexDirection}>
            <View style={styles.widthHalf}>
              <Text variant="text" color="black" style={styles.inputTitle}>
                Expire date
              </Text>
              <CustomTextInput
                value={cardDate}
                placeholder="mm/yyyy"
                onChangeText={(text) => setCardDate(text)}
                onBlurText={onBlurCard}
              />
            </View>
            <View style={styles.widthHalf}>
              <Text variant="text" color="black" style={styles.inputTitle}>
                CVV
              </Text>
              <CustomTextInput
                value={cvv}
                placeholder="***"
                onChangeText={(text) => setCvv(text)}
                onBlurText={onBlurCard}
              />
            </View>
          </View>*/}
        </View>
        <Button loading={loading} text="Add Card" mt={20} onPress={addCard}/>
      </View>
    </BaseScreen>
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
    justifyContent: "space-between"
  },
  widthHalf: {
    width: '47%',
  }
})

export default AddCard;
