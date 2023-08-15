import {CustomTextInput} from "components/CustomTextInput";
import {Text} from "components/text";
import React, {useEffect} from 'react'
import {Button, Modal, Pressable, StyleSheet, View} from "react-native";
import {color} from "utils";

const AddressModal = ({data, visible, onOk, onCancel}) => {
  const [street, setStreet] = React.useState('')
  const [city, setCity] = React.useState('')
  const [state, setState] = React.useState('')
  const [zip_code, setZipCode] = React.useState('')

  useEffect(() => {
    if (data) {
      setStreet(data.street)
      setCity(data.city)
      setState(data.state)
      setZipCode(data.zip_code)
    } else {
      setStreet('')
      setCity('')
      setState('')
      setZipCode('')
    }
  }, [data])
  const save = () => {
    if (street && city && state && zip_code) {
      onOk(data?.id, {
        street,
        city,
        state,
        zip_code,
      })
    }
  }

  return <Modal
    style={styles.modal}
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modal}>
      <View style={styles.modalView}>
        <Text variant="text" color="black">
          Street
        </Text>
        <CustomTextInput
          value={street}
          onChangeText={(text) => setStreet(text)}
        />
        <Text variant="text" color="black">
          City
        </Text>
        <CustomTextInput
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <View style={styles.stateView}>
          <View style={{width: '47%'}}>
            <Text variant="text" color="black">
              State
            </Text>
            <CustomTextInput
              value={state}
              onChangeText={(text) => setState(text)}
            />
          </View>
          <View style={{width: '47%'}}>
            <Text variant="text" color="black">
              Zip Code
            </Text>
            <CustomTextInput
              keyboardType={'number-pad'}
              value={zip_code}
              onChangeText={(text) => setZipCode(text)}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
          <Pressable style={styles.cancel} onPress={onCancel}>
            <Text variant={'h5'} color={'white'}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.ok} onPress={save}>
            <Text variant={'h5'} color={'white'}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
}

export default AddressModal

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
  stateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    backgroundColor: color.error,
  },
})
