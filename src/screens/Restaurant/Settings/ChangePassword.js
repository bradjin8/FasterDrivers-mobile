import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import SimpleHeader from "components/SimpleHeader";
import { changePassword } from "../../../screenRedux/loginRedux";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = ({}) => {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.loginReducer.loading)
  const [oldPass, setOldPass] = useState(null)
  const [oldError, setOldError] = useState(null)
  const [newPass, setNewPass] = useState(null)
  const [newError, setNewError] = useState(null)
  const [newRepeat, setNewRepeat] = useState(null)
  const [newRepeatError, setNewRepeatError] = useState(null)
  
  const onBlurPassword = () => {
    if(!newPass) {
      setNewError(true)
    } else {
      setNewError(false)
    }
  }
  const onBlurRePassword = () => {
    if(!newPass || newRepeat !== newPass) {
      setNewRepeatError(true)
    } else {
      setNewRepeatError(false)
    }
  }
  const onBlurOldPassword = () => {
    if(!oldPass) {
      setOldError(true)
    } else {
      setOldError(false)
    }
  }
  
  const changePass = () => {
    if(oldPass && newPass && newRepeat === newPass) {
      let data = new FormData();
      data.append('current_password', oldPass);
      data.append('password_1', newPass);
      data.append('password_2', newRepeat);
      dispatch(changePassword(data))
    } else  {
      onBlurOldPassword();
      onBlurPassword();
      onBlurRePassword();
    }
  }
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Change Password"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <TouchableHighlight style={styles.imageButton}>
          <Image source={Images.Capture} style={styles.icon} />
        </TouchableHighlight>
        
        <View>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Old Password
          </Text>
          <CustomTextInput
            value={oldPass}
            onChangeText={(text) => setOldPass(text)}
            onBlurText={onBlurOldPassword}
            hasError={oldError}
            errorMessage={"Enter old password"}
            placeholder="********"
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            New Password
          </Text>
          <CustomTextInput
            value={newPass}
            onChangeText={(text) => setNewPass(text)}
            onBlurText={onBlurPassword}
            hasError={newError}
            errorMessage={"Enter new password"}
            placeholder="********"
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Repeat Password
          </Text>
          <CustomTextInput
            value={newRepeat}
            onChangeText={(text) => setNewRepeat(text)}
            onBlurText={onBlurRePassword}
            hasError={newRepeatError}
            placeholder="********"
            errorMessage={"Enter repeat password"}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}}>
          <Button text='Save' loading={loading} fontSize={16} onPress={() => changePass()}  mt={30} fontWeight="700" />
        </View>
      </View>
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  imageButton: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginVertical: scaleVertical(25),
    backgroundColor: color.lightGray,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: scale(36),
    height: scaleVertical(30),
    tintColor: 'white'
  }
})

export default ChangePassword;
