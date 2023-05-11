import SimpleHeader from "components/SimpleHeader";
import React, {useRef, useState} from "react";
import {Image, Platform, Pressable, StyleSheet, View} from "react-native";
import ActionSheet from "react-native-actionsheet";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {pickFromCamera, pickFromGallery} from "utils/Camera";
import {Button, CustomTextInput, Text} from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import {updateAccount} from "../../../screenRedux/loginRedux";

const AccountInformation = () => {
  const actionSheet = useRef(null);
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const dispatch = useDispatch();
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [changeImage, setChangeImage] = useState(null)
  const { name, email, driver: { phone, street, city, state, zip_code, photo } } = user
  const [pickImage, setPickImage] = useState(photo)

  const [customerDetails, setCustomerDetails] = useState({
    "name": name,
    "email": email,
    "driver.phone": phone,
    "driver.street": street,
    "driver.city": city,
    "driver.state": state,
    "driver.zip_code": zip_code,
  })

  const onChangeText = (key, text) => {
    setCustomerDetails(prevState => ({ ...prevState, [key]: text }));
  }

  const onSave = () => {
    let data = new FormData();
    if(changeImage) {
      data.append('driver.photo', {
        name: `rnd-${pickImage.path}`,
        type: pickImage.mime,
        uri: Platform.OS === 'ios' ? pickImage.sourceURL.replace('file://', '') : pickImage.path,
        data: pickImage.data
      });
    }
    data.append("name", customerDetails.name);
    data.append("email", customerDetails.email);
    data.append("driver.phone", customerDetails["driver.phone"]);
    data.append("driver.street", customerDetails["driver.street"]);
    data.append("driver.city", customerDetails["driver.city"]);
    data.append("driver.state", customerDetails["driver.state"]);
    data.append("driver.zip_code", customerDetails["driver.zip_code"]);

    dispatch(updateAccount(data))
  }

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
             <Image source={{uri: changeImage ? pickImage?.path : pickImage}} style={styles.actualImage} defaultSource={Images.Capture} />
                       :
             <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon} />
            }
          </Pressable>
        </View>

        <View>
          <Text variant="text" color="black" >
            Full Name
          </Text>
          <CustomTextInput
            value={customerDetails["name"]}
            onChangeText={(text) => onChangeText("name", text)}
          />
          <Text variant="text" color="black" >
            Email
          </Text>
          <CustomTextInput
            value={customerDetails["email"]}
            onChangeText={(text) => onChangeText("email", text)}
          />
          <Text variant="text" color="black" >
            Phone Number
          </Text>
          <CustomTextInput
            value={customerDetails["driver.phone"]}
            keyboardType={'phone-pad'}
            onChangeText={(text) => onChangeText("driver.phone", text)}
          />
          <Text variant="text" color="black" >
            Address
          </Text>
          <CustomTextInput
            value={customerDetails["driver.street"]}
            onChangeText={(text) => onChangeText("driver.street", text)}
          />
          <View style={styles.stateView}>
            <View style={{width: '47%'}}>
              <Text variant="text" color="black" >
                City
              </Text>
              <CustomTextInput
                value={customerDetails["driver.city"]}
                onChangeText={(text) => onChangeText("driver.city", text)}
              />
            </View>
            <View style={{width: '47%'}}>
              <Text variant="text" color="black" >
                State
              </Text>
              <CustomTextInput
                value={customerDetails["driver.state"]}
                onChangeText={(text) => onChangeText("driver.state", text)}
              />
            </View>
          </View>
        </View>
        <View style={{width: '47%'}}>
          <Text variant="text" color="black" >
            Zip Code
          </Text>
          <CustomTextInput
            keyboardType={'number-pad'}
            value={customerDetails["driver.zip_code"]}
            onChangeText={(text) => onChangeText("driver.zip_code", text)}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}}>
          <Button text='Save' loading={loading} fontSize={16} onPress={() => onSave()}  mt={30} fontWeight="700" />
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
              res = await pickFromGallery();
              break;
          }
          if (res) {
            setChangeImage(true)
            setPickImage(res)
          }
        }}
      />
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  imageContain: {width: '100%', justifyContent: 'center',alignItems: 'center'},
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
    borderRadius: scaleVertical(40)
  },
  icon: {
    width: scale(36),
    height: scaleVertical(30),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  stateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default AccountInformation;
