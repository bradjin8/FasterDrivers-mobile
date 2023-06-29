import {Text} from "components/text";
import React from 'react'
import {Modal, Pressable, StyleSheet, View} from "react-native";
import {color} from "utils";
import {Flex, Margin, Padding} from "../theme/Styles";

const ConfirmModal = ({title, message, visible, onOk, onCancel, okCaption, cancelCaption}) => {
  return <Modal
    style={styles.modal}
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modal}>
      <View style={styles.modalView}>
        <View style={[Flex.itemsCenter, Padding.v5]}>
          <Text variant={'strong'} fontSize={20}>{title || ''}</Text>
        </View>
        <View style={[Flex.itemsCenter, Padding.v5]}>
          <Text >{message || ''}</Text>
        </View>

        <View style={[Margin.t30, Flex.column, ]}>
          <Pressable style={[styles.cancel, Margin.v5]} onPress={onCancel}>
            <Text variant={'strong'} color={'white'}>{cancelCaption}</Text>
          </Pressable>
          <Pressable style={[styles.ok, Margin.v5]} onPress={onOk}>
            <Text variant={'strong'} color={'white'}>{okCaption}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
}

export default ConfirmModal

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'space-between',
  },
  ok: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: color.error,
  },
  cancel: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: color.primary,
  },
})
