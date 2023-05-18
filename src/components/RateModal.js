import {CustomTextInput} from "components/CustomTextInput";
import {Text} from "components/text";
import React, {useEffect, useState} from 'react'
import {Button, Image, Modal, Pressable, StyleSheet, TextInput, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import StarRating from "react-native-star-rating-new";
import {color, scale, scaleVertical} from "utils";
import {ORDER_REVIEW_MODE} from "../consts/orders";
import {rateDriver, rateRestaurant} from "../screenRedux/customerRedux";
import {Flex, Margin, Padding, Templates} from "../theme/Styles";

const RateModal = ({order, visible, close, mode}) => {
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')
  console.log('order', order)
  const save = () => {
    if (rate === 0) {
      return alert('Please set your rate')
    }

    let data = new FormData()
    data.append('rating', rate)
    data.append('order', order?.id)
    data.append('context', review)
    switch (mode) {
      case ORDER_REVIEW_MODE.DRIVER:
        data.append('driver', order?.driver?.driver?.id)
        rateDriver(data)
          .then(() => {
            showMessage({
              message: 'Review left',
              type: 'success',
            })
            close()
          })
          .catch((e) => {
            console.log('e', e?.response?.data)
          })
        break
      case ORDER_REVIEW_MODE.RESTAURANT:
        data.append('restaurant', order?.restaurant?.id)
        rateRestaurant(data)
          .then(() => {
            showMessage({
              message: 'Review left',
              type: 'success',
            })
            close()
          })
          .catch((e) => {
            console.log('e', e)
          })
        break
    }
  }

  useEffect(() => {
    if (visible) {
      setRate(0)
      setReview('')
    }
  }, [visible])

  return <Modal
    style={styles.modal}
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={close}
  >
    <View style={styles.modal}>
      <View style={styles.modalView}>
        {mode === ORDER_REVIEW_MODE.DRIVER && <View style={[Flex.itemsCenter, Padding.v5]}>
          <Image source={{uri: order?.driver?.driver?.photo}} style={[Templates.avatar, Margin.v5]}/>
          <Text variant={'strong'}>Rate {order?.driver?.name}'s delivery</Text>
        </View>}
        {mode === ORDER_REVIEW_MODE.RESTAURANT && <View style={[Flex.itemsCenter, Padding.v5]}>
          <Image source={{uri: order?.restaurant?.photo}} style={[Templates.image, Margin.v5]}/>
          <Text variant={'strong'}>Rate {order?.restaurant?.name} Restaurant</Text>
        </View>}
        <View style={styles.rateContainer}>
          <Text variant={'strong'}>Tap to Rate</Text>
          <StarRating
            rating={rate}
            starSize={20}
            fullStarColor={color.primary}
            containerStyle={styles.rateStar}
            halfStarEnabled={false}
            selectedStar={(rating) => setRate(rating)}
          />
        </View>
        <Text variant='strong'>Review the {mode}:</Text>
        <TextInput
          style={styles.reviewText}
          placeholder={'Write your review here'}
          placeholderTextColor={color.darkGray}
          multiline
          numberOfLines={10}
          value={review}
          onChangeText={(text) => setReview(text)}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
          <Pressable style={styles.cancel} onPress={close}>
            <Text variant={'strong'} color={'item'}>Later</Text>
          </Pressable>
          <Pressable style={styles.ok} onPress={save}>
            <Text variant={'strong'} color={'white'}>Rate Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
}

export default RateModal

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  ok: {
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: color.primary,
  },
  cancel: {
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  rateStar: {
    marginLeft: wp(2),
    width: wp(30)
  },
  reviewText: {
    marginTop: scale(10),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: color.black,
    paddingHorizontal: scale(10),
    paddingVertical: scale(30),
    height: scaleVertical(100),
  }
})
