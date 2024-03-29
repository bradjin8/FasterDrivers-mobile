import React, {useEffect, useState} from "react";
import {ActivityIndicator, Linking, StyleSheet, View} from "react-native";
import CheckBoxIcon from "react-native-elements/dist/checkbox/CheckBoxIcon";
import {useSelector} from "react-redux";
import {scaleVertical} from "utils";
import {Button} from "../../../components/button";
import SimpleHeader from "../../../components/SimpleHeader";
import {Text} from "../../../components/text";
import {checkStripeStatus, setUpStripeAccount} from "../../../screenRedux/restaurantRedux";
import {Flex, Margin, Padding} from "../../../theme/Styles";
import {color} from "../../../utils/color";

const StripeConnect = ({navigation, route}) => {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [webUrl, setWebUrl] = useState('')
  const {user} = useSelector(state => state.loginReducer)
  const params = route?.params

  const type = user?.type?.toLowerCase() || 'restaurant'

  const fetchStripeStatus = () => {
    setLoading(true)
    checkStripeStatus()
      .then(res => {
        // console.log('stripe-status', res.status)
        if (res.status === 200) {
          setEnabled(true)
        } else {
          setEnabled(false)
        }
      })
      .finally(() => setLoading(false))
  }

  const setUpBilling = () => {
    setLoading(true)
    setUpStripeAccount()
      .then(res => res.data)
      .then(data => {
        // console.log('link-account', data)
        const {
          link: {
            url: stripeUrl
          }
        } = data
        if (stripeUrl) {
          // Linking.openURL(stripeUrl)
          navigation.navigate('StripeWebView', {url: stripeUrl})
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStripeStatus()
    });
    // fetchStripeStatus()
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (params?.type === 'reauth' && !enabled) {
      setUpBilling()
    }
  }, [params])

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Set Up Stripe Payment"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={[Margin.v20]}>
          <Text variant={'h5'} fontSize={14} color={'item'} style={Margin.v20}>
            IN ORDER TO COLLECT CREDIT CARD PAYMENTS YOU WILL HAVE TO SET UP A STRIPE ACCOUNT.
          </Text>
          <Text style={Margin.v20}>
            Taking payments with Stripe is easy, just click on the button below and follow the steps and Set Up Stripe.
          </Text>
        </View>
        <View style={[Flex.itemsCenter, Flex.justifyCenter, Margin.v20]}>
          {loading ? <ActivityIndicator/> :
            enabled ?
              <CheckBoxIcon
                checked={true}
                checkedColor={color.primary}
                uncheckedColor={color.primary}
                size={30}/> :
              <Button text={'Set Up Stripe Payment'} onPress={setUpBilling} style={[Padding.h20]} fontSize={16}/>
          }
        </View>
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
  webView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})

export default StripeConnect;
