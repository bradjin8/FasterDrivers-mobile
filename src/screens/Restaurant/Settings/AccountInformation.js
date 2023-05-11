import React, {useRef, useState} from "react";
import {StyleSheet, View, Image, TouchableHighlight, Platform, Pressable} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import {pickFromCamera, pickFromGallery} from "utils/Camera";
import { Button, CustomTextInput, Text } from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import validator from "utils/validation";
import SimpleHeader from "components/SimpleHeader";
import ActionSheet from "react-native-actionsheet";
import {updateAccount} from "../../../screenRedux/loginRedux";

const AccountInformation = ({ navigation }) => {
  const actionSheet = useRef(null)
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];

  const {loading, user} = useSelector(state => state.loginReducer)

  const [userName, setUserName] = useState(user.name || '')
  const [userError, setUserError] = useState(null)
  const [email, setEmail] = useState(user.email || '')
  const [emailError, setEmailError] = useState(null)
  const [phone, setPhone] = useState(user?.restaurant?.phone || '')
  const [phoneError, setPhoneError] = useState(null)
  const [pickImage, setPickImage] = useState(user?.restaurant?.photo)
  const [changeImage, setChangeImage] = useState(null)

  const dispatch = useDispatch()

  const onBlurUser = () => {
    if(!userName) {
      setUserError(true)
    } else {
      setUserError(false)
    }
    if(!validator.email.regEx.test(email)) {
      setEmailError(true)
    } else {
      setEmailError(false)
    }
    if(!phone) {
      setPhoneError(true)
    } else {
      setPhoneError(false)
    }
  }
  const onSave = () => {
    let data = new FormData();
    if(changeImage) {
      data.append('restaurant.photo', {
        name: `rnd-${pickImage.path}`,
        type: pickImage.mime,
        uri: Platform.OS === 'ios' ? pickImage.sourceURL.replace('file://', '') : pickImage.path,
        data: pickImage.data
      });
    }
    data.append('name', userName);
    if(validator.email.regEx.test(email)) {
      data.append('email', email)
    }
    data.append('restaurant.phone', phone);
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
              <Image source={Images.Edit} style={{width: scaleVertical(12), height: scaleVertical(12)}} />
            </View>
            {pickImage ?
              <Image source={{uri: changeImage ? pickImage?.path : pickImage}} style={styles.actualImage} defaultSource={Images.Capture} />
              :
              <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon} />
            }
          </Pressable>
        </View>

        <View>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Full Name
          </Text>
          <CustomTextInput
            value={userName}
            onChangeText={(text) => setUserName(text)}
            onBlurText={onBlurUser}
            hasError={userError}
            errorMessage={"Enter full name"}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Email
          </Text>
          <CustomTextInput
            keyboardType={'email-address'}
            value={email}
            onChangeText={(text) => setEmail(text)}
            onBlurText={onBlurUser}
            hasError={emailError}
            errorMessage={"Enter valid email"}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Phone Number
          </Text>
          <CustomTextInput
            keyboardType={'phone-pad'}
            value={phone}
            onChangeText={(text) => setPhone(text)}
            onBlurText={onBlurUser}
            hasError={phoneError}
            errorMessage={"Enter phone number"}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}} >
          <Button loading={loading} text='Save' fontSize={16} onPress={onSave}  mt={30} fontWeight="700" />
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
    tintColor: 'white'
  },
})

export default AccountInformation;
