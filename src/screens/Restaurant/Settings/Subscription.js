import BaseScreen from "components/BaseScreen";
import OrDivider from "components/OrDivider";
import {goBack} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, View, Image, Share, Linking, ActivityIndicator} from "react-native";
import {showMessage} from "react-native-flash-message";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Button, Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {appConfig} from "../../../config/app";
import {fetchSubscriptionsAPI} from "../../../screenRedux/loginRedux";
import Images from "../../../theme/Images";
import {Border, Flex, Margin, Padding} from "../../../theme/Styles";

const Subscription = ({}) => {
  const {user, accessToken} = useSelector(state => state.loginReducer)

  const [loading, setLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [selectedSubscriptionIndex, setSelectedSubscriptionIndex] = useState(-1)

  const userSubscription = user[user.type.toLowerCase()]?.subscription // || subscriptions[0]
  const activeSubscription = selectedSubscriptionIndex > -1 ? subscriptions[selectedSubscriptionIndex] : null
  const isSubscribedPlan = activeSubscription && activeSubscription?.id === userSubscription?.id
  const fetchSubscription = () => {
    setLoading(true)
    fetchSubscriptionsAPI()
      .then(res => {
        if (res?.status === 200) {
          // console.log('fetchSubscriptionsAPI', res?.data?.data)
          setSubscriptions(res?.data?.data || [])
        }
      })
      .catch(e => {
        showMessage({
          message: 'Fetch subscription error: ' + (e?.response?.data?.message || 'Something went wrong'),
          type: 'danger',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // console.log('activeSubscription', activeSubscription, subscriptions)

  const subscribe = () => {
    if (activeSubscription) {
      if (isSubscribedPlan) {
        showMessage({
          message: 'Implement unsubscribe here...',
          type: 'info',
        })
      } else {
        showMessage({
          message: 'Implement payment selection screen here...',
          type: 'info',
        })
      }
    } else {
      showMessage({
        message: 'Please select a subscription plan',
        type: 'danger',
      })
    }
  }

  const continueFreeTrial = () => {
    goBack()
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  useEffect(() => {
    if (subscriptions.length > 0) {
      if (userSubscription) {
        setSelectedSubscriptionIndex(subscriptions.findIndex(s => s.id === userSubscription.id))
      } else {
        // setSelectedSubscriptionIndex(0)
      }
    }
  }, [subscriptions])

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Subscription"
        showBackIcon={true}
      />

      <View style={styles.container}>
        <Image
          source={Images.AppLogo}
          style={styles.icon}
          resizeMode={'contain'}
        />
        {loading && <ActivityIndicator/>}

        {subscriptions.map((sub, id) => <Pressable
          style={[Margin.v10, styles.card, {borderColor: sub.id === activeSubscription?.id ? 'blue' : 'white'}]} key={id}
          onPress={() => setSelectedSubscriptionIndex(id)}
        >
          <View style={[styles.header, Flex.itemsCenter, Padding.v20,]}>
            <Text color={'white'} fontSize={20} variant={'strong'} style={styles.headerText}>{sub.interval + 'ly plan'}</Text>
          </View>
          <View style={[Flex.itemsCenter, Padding.v20, Padding.h10]}>
            <Text>Premium subscription plan</Text>
          </View>
          <View style={[styles.footer, Flex.itemsCenter, Padding.v20]}>
            <Text fontWeight={'800'} fontSize={18}>
              ${sub.amount / 100} / {sub.interval}
            </Text>
          </View>
        </Pressable>)}

        <View style={[styles.buttons, Margin.t30]}>
          {activeSubscription && <Button
            text={isSubscribedPlan ? 'Unsubscribe' : 'Subscribe'}
            fontSize={18}
            style={{...Border.round10, backgroundColor: isSubscribedPlan ? color.error : color.primary}}
            onPress={subscribe}
          />}
          {userSubscription === null && <Button isSecondary={true} text={'Continue Free Trial'} fontSize={18} style={[Border.round10, Margin.t10, {width: '100%'}]} onPress={continueFreeTrial}/>}
        </View>
      </View>

    </BaseScreen>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {
    backgroundColor: color.white,
    paddingHorizontal: scaleVertical(25),
    paddingVertical: scaleVertical(10),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: scale(200),
    height: scaleVertical(100),
    marginBottom: scaleVertical(20),
  },
  card: {
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowColor: color.lightGray,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
  },
  header: {
    backgroundColor: color.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  headerText: {
    textTransform: 'capitalize'
  },
  footer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: color.primary
  },
  buttons: {
    width: '100%',
  }
})

export default Subscription;


