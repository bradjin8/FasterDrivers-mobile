import React, {useEffect, useState} from "react";
import {ActivityIndicator, Linking, StyleSheet, View} from "react-native";
import {scaleVertical} from "utils";
import {color} from "../../../utils/color";
import SimpleHeader from "../../../components/SimpleHeader";
import {checkStripeStatus, setUpStripeAccount} from "../../../screenRedux/restaurantRedux";
import {Text} from "../../../components/text";
import {Button} from "../../../components/button";

const Wallet = ({navigation}) => {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchStipeStatus = () => {
    setLoading(true)
    checkStripeStatus()
      .then(res => res.data)
      .then(data => {
        const {
          restaurant: {
            connect_account: {
              charges_enabled: chargesEnabled,
              payouts_enabled: payoutsEnabled,
            }
          }
        } = data
        console.log('chargesEnabled', chargesEnabled)
        console.log('payoutsEnabled', payoutsEnabled)
        setEnabled(payoutsEnabled === true)
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
          Linking.openURL(stripeUrl)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStipeStatus()
    });
    fetchStipeStatus()
    return unsubscribe
  }, [])

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Wallet"
        showBackIcon={true}
      />
      <View style={styles.container}>
        {loading ? <ActivityIndicator/> :
          enabled ?
            <Text variant={'h5'} fontSize={14} color={'item'}>Your restaurant billing is enabled</Text> :
            <Button text={'Enable billing'} onPress={setUpBilling}/>
        }
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
})

export default Wallet;
