import SimpleHeader from "components/SimpleHeader";
import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Button, CustomTextInput, Text} from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import {changePassword} from "../../../screenRedux/loginRedux";

const ChangePassword = ({}) => {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.loginReducer.loading)
  const [oldPass, setOldPass] = useState(null)
  const [oldError, setOldError] = useState(null)
  const [newPass, setNewPass] = useState(null)
  const [newError, setNewError] = useState(null)
  const [newRepeat, setNewRepeat] = useState(null)
  const [newRepeatError, setNewRepeatError] = useState(null)

  const [errMsgMap, setErrMsgMap] = useState({
    oldPass: '',
    newPass: '',
    newRepeat: ''
  })

  const onBlurPassword = () => {
    if (!newPass) {
      setNewError(true)
      setErrMsgMap({...errMsgMap, newPass: 'Enter new password'})
    } else {
      setNewError(false)
    }
  }
  const onBlurRePassword = () => {
    if (!newPass || newRepeat !== newPass) {
      setNewRepeatError(true)
      if (!newPass) {
        setErrMsgMap({...errMsgMap, newRepeat: 'Enter repeat password'})
      } else {
        setErrMsgMap({...errMsgMap, newRepeat: 'Repeat password not match'})
      }
    } else {
      setNewRepeatError(false)
    }
  }
  const onBlurOldPassword = () => {
    if (!oldPass) {
      setOldError(true)
      setErrMsgMap({...errMsgMap, oldPass: 'Enter current password'})
    } else {
      setOldError(false)
    }
  }

  const changePass = () => {
    if (oldPass && newPass && newRepeat === newPass) {
      let data = new FormData();
      data.append('current_password', oldPass);
      data.append('password_1', newPass);
      data.append('password_2', newRepeat);
      dispatch(changePassword(data))
    } else {
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
        <View>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Old Password
          </Text>
          <CustomTextInput
            secureTextEntry
            value={oldPass}
            onChangeText={(text) => setOldPass(text)}
            onBlurText={onBlurOldPassword}
            hasError={oldError}
            errorMessage={errMsgMap.oldPass}
            placeholder="********"
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            New Password
          </Text>
          <CustomTextInput
            secureTextEntry
            value={newPass}
            onChangeText={(text) => setNewPass(text)}
            onBlurText={onBlurPassword}
            hasError={newError}
            errorMessage={errMsgMap.newPass}
            placeholder="********"
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Repeat Password
          </Text>
          <CustomTextInput
            secureTextEntry
            value={newRepeat}
            onChangeText={(text) => setNewRepeat(text)}
            onBlurText={onBlurRePassword}
            hasError={newRepeatError}
            placeholder="********"
            errorMessage={errMsgMap.newRepeat}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}}>
          <Button text='Save' loading={loading} fontSize={16} onPress={() => changePass()} mt={30} fontWeight="700"/>
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
