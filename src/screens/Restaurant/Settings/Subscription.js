import BaseScreen from "components/BaseScreen";
import ConfirmModal from "components/ConfirmModal";
import {goBack} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {useDispatch, useSelector} from "react-redux";
import {Button, Text} from "src/components/index";
import SimpleHeader from "src/components/SimpleHeader";
import {fetchProfileRequest, fetchSubscriptionsAPI, loginReducer, unsubscribeRequest} from "src/screenRedux/loginRedux";
import Images from "src/theme/Images";
import {Border, Flex, Margin, Padding} from "src/theme/Styles";
import {color, scale, scaleVertical} from "utils";

const Subscription = ({navigation}) => {
  const {user, accessToken} = useSelector(state => state.loginReducer)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [selectedSubscriptionIndex, setSelectedSubscriptionIndex] = useState(-1)

  const userSubscription = user[user.type.toLowerCase()]?.subscription // || subscriptions[0]
  const activeSubscription = selectedSubscriptionIndex > -1 ? subscriptions[selectedSubscriptionIndex] : null
  const isSubscribed = userSubscription?.status === 'active' || false
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

  console.log('activeSubscription', userSubscription)
  console.log('token', accessToken, isSubscribed)

  const tryUnsubscribe = () => {
    if (activeSubscription !== null && isSubscribed) {
      dispatch(unsubscribeRequest())
    }
    setOpenConfirmModal(false)
  }
  const subscribe = () => {
    if (activeSubscription) {
      if (isSubscribed) {
        setOpenConfirmModal(true)
        // showMessage({
        //   message: 'Implement unsubscribe here...',
        //   type: 'info',
        // })
      } else {
        // showMessage({
        //   message: 'Implement payment selection screen here...',
        //   type: 'info',
        // })
        navigation.navigate('Payment', {subscription: activeSubscription})
      }
    } else {

      // showMessage({
      //   message: 'Please select a subscription plan',
      //   type: 'danger',
      // })
    }
  }

  const continueFreeTrial = () => {
    // goBack()
  }

  useEffect(() => {
    fetchSubscription()
    dispatch(fetchProfileRequest())
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
        onBackPress={() => {
          navigation.navigate('Settings')
        }}
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
            text={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            fontSize={18}
            style={{...Border.round10, backgroundColor: isSubscribed ? color.error : color.primary}}
            onPress={subscribe}
          />}
          {false && <Button isSecondary={true} text={'Continue Free Trial'} fontSize={18} style={[Border.round10, Margin.t10, {width: '100%'}]} onPress={continueFreeTrial}/>}
        </View>
      </View>
      <ConfirmModal
        visible={openConfirmModal}
        title={'Are You Sure?'}
        message={'Are you sure you want to unsubscribe?'}
        onOk={tryUnsubscribe}
        onCancel={() => setOpenConfirmModal(false)}
        okCaption={'Cancel Subscription'}
        cancelCaption={'Don\'t Cancel'}
      />
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


