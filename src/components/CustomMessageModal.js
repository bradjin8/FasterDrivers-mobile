import {Text} from "components/text";
import React from 'react'
import {Modal, Pressable, StyleSheet, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {color, scale, scaleVertical} from "utils";
import {Flex, Padding} from "../theme/Styles";

const CustomMessageModal = ({data, visible, onOk, close}) => {
  console.log('data', data)

  const title = data?.title ?? 'Custom Message'
  const message = data?.message ?? 'Lorem Ipsum Dolor Sit Amet Consectetur. Sagittis Adipiscing Plvinar Bibendum Sit Eget Eget Commodo. Risus Sed Urna Pellentesque'
  const onUnderstand = () => {
    onOk()
    close()
  }

  return <Modal
    style={styles.modal}
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={close}
  >
    <View style={styles.modal}>
      <View style={styles.modalView}>
        <View style={[Flex.itemsCenter, Padding.v5]}>
          <Text variant={'h3'}>{title}</Text>
        </View>
        <View style={[Flex.itemsCenter, Padding.v10]}>
          <Text variant={'text'} style={{lineHeight: 20}}>{message}</Text>
        </View>
        <View style={[Flex.row, Flex.justifyCenter, Padding.v10]}>
          <Pressable style={styles.ok} onPress={onUnderstand}>
            <Text variant={'strong'} color={'white'}>I understand</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
}

export default CustomMessageModal

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
