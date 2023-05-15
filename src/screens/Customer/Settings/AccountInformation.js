import AddressModal from "components/AddressModal";
import SimpleHeader from "components/SimpleHeader";
import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, View} from "react-native";
import ActionSheet from "react-native-actionsheet";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {pickFromCamera, pickFromGallery} from "utils/Camera";
import {Button, CustomTextInput, Text} from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import {addAddress, deleteAddress, getAddressesData, updateAddress} from "../../../screenRedux/customerRedux";
import {updateAccount} from "../../../screenRedux/loginRedux";

const AccountInformation = ({navigation}) => {
  const actionSheet = useRef(null);
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const dispatch = useDispatch();
  const {user, loading} = useSelector(state => state.loginReducer)
  const {locationLoading, addresses} = useSelector(state => state.customerReducer)
  const {name, email, customer} = user

  const [changeImage, setChangeImage] = useState(null)
  const [pickImage, setPickImage] = useState(customer.photo)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeAddress, setActiveAddress] = useState(null)

  const [customerDetails, setCustomerDetails] = useState({
    "name": name || "",
    "email": email || "",
    "customer.phone": customer.phone || "",
  })

  const onChangeText = (key, text) => {
    setCustomerDetails(prevState => ({...prevState, [key]: text}));
  }

  const onSave = () => {
    // console.log('image', pickImage)
    let data = new FormData();
    if (changeImage) {
      data.append('customer.photo', {
        name: `rnd-${pickImage.path}`,
        type: pickImage.mime,
        // uri: Platform.OS === 'ios' ? pickImage.sourceURL?.replace('file://', '') || pickImage.path : pickImage.path,
        uri: pickImage.path,
        data: pickImage.data
      });
    }
    data.append("name", customerDetails.name);
    data.append("email", customerDetails.email);
    data.append("customer.phone", customerDetails["customer.phone"]);
    dispatch(updateAccount(data))
  }

  const onOk = (id, data) => {
    setModalVisible(false)
    if (id) {
      dispatch(updateAddress(id, data))
    } else {
      let formData = new FormData();
      formData.append("customer.addresses[0]street", data.street);
      formData.append("customer.addresses[0]city", data.city);
      formData.append("customer.addresses[0]state", data.state);
      formData.append("customer.addresses[0]zip_code", data.zip_code);
      dispatch(addAddress(formData))
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAddressesData())
    });

    return unsubscribe;
  }, [])

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="My Account"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.imageContain}>
          <Pressable style={styles.imageButton} onPress={() => actionSheet.current.show()}>
            <View style={styles.pencileView}>
              <SimpleLineIcons name={'pencil'} size={scale(12)} color={color.black}/>
            </View>
            {pickImage ?
              <Image source={{uri: changeImage ? pickImage?.path : pickImage}} style={styles.actualImage} defaultSource={Images.Capture}/>
              :
              <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon}/>
            }
          </Pressable>
        </View>

        <View>
          <Text variant="text" color="black">
            Full Name
          </Text>
          <CustomTextInput
            value={customerDetails["name"]}
            onChangeText={(text) => onChangeText("name", text)}
          />
          <Text variant="text" color="black">
            Email
          </Text>
          <CustomTextInput
            keyboardType={'email-address'}
            value={customerDetails["email"]}
            onChangeText={(text) => onChangeText("email", text)}
          />
          <Text variant="text" color="black">
            Phone Number
          </Text>
          <CustomTextInput
            keyboardType={'phone-pad'}
            value={customerDetails["customer.phone"]}
            onChangeText={(text) => onChangeText("customer.phone", text)}
          />
          <View style={styles.row}>
            <Text variant="text" color="black">
              Addresses
            </Text>
            <Pressable style={styles.row} onPress={() => {
              setActiveAddress(null);
              setModalVisible(true);
            }}>
              <Text variant={'strong'} color={'primary'}>Add</Text>
              <MaterialCommunityIcons name={'plus'} size={scale(20)} color={color.primary}/>
            </Pressable>
          </View>
          {locationLoading ? <ActivityIndicator/> : addresses.map((it, id) => {
            return (<View key={id} style={styles.addressList}>
              <Pressable onPress={() => {
                setActiveAddress(it)
                setModalVisible(true)
              }}
              >
                <Text fontSize={12}>{it.street} {it.city} {it.state}, {it.zip_code}</Text>
              </Pressable>
              <View style={{flexDirection: 'row', width: scale(40), justifyContent: 'space-between'}}>
                <Pressable onPress={() => {
                }}>
                  {/*<AntDesign name={'edit'} size={scale(16)} color={color.primary}/>*/}
                </Pressable>
                <Pressable onPress={() => {
                  dispatch(deleteAddress(it.id))
                }}>
                  <Entypo name={'circle-with-cross'} size={scale(16)} color={color.error}/>
                </Pressable>
              </View>
            </View>)
          })}
        </View>
        <View style={{marginBottom: scaleVertical(10)}}>
          <Button text='Save' loading={loading} fontSize={16} onPress={() => onSave()} mt={30} fontWeight="700"/>
        </View>
      </View>
      <ActionSheet
        ref={actionSheet}
        title={"Select Image"}
        options={ImagePickerOptions}
        cancelButtonIndex={2}
        onPress={async (index) => {
          let res;
          switch (index) {
            case 0:
              res = await pickFromCamera();
              break;
            case 1:
              res = await pickFromGallery(400, 400);
              break;
          }
          if (res) {
            console.log('image', res)
            setChangeImage(true)
            setPickImage(res)
          }
        }}
      />
      <AddressModal data={activeAddress} visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={onOk}/>
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContain: {width: '100%', justifyContent: 'center', alignItems: 'center'},
  imageButton: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginVertical: scaleVertical(25),
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pencileView: {
    width: scaleVertical(25), height: scaleVertical(25), borderRadius: scaleVertical(12.5),
    backgroundColor: color.white, position: 'absolute', top: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 100
  },
  actualImage: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    resizeMode: 'contain'
  },
  icon: {
    width: scale(36),
    height: scaleVertical(30),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  addressList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(10),
    height: scaleVertical(40),
    paddingHorizontal: scale(10),
    paddingVertical: scaleVertical(5),
    marginVertical: scaleVertical(5),
    backgroundColor: color.slightGray,
  },
})

export default AccountInformation;
