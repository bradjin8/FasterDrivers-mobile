import React, {useState} from "react";
import {Alert, Image, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import validator from "utils/validation";
import BaseScreen from "../../components/BaseScreen";
import {Button, CustomTextInput, Text} from "../../components/index";
import {forgotPasswordAPI, forgotPasswordRequest} from "../../screenRedux/loginRedux";

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const {loading} = useSelector(state => state.loginReducer)

  const onResetPassword = () => {
    if (email && validator.email.regEx.test(email)) {
      // api call
      const data = new FormData()
      data.append('email', email)
      dispatch(forgotPasswordRequest(data))
    } else {
      Alert.alert('Please enter valid email')
    }
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.imageView}>
          <Image
            source={Images.AppLogo}
            style={styles.icon}
          />
        </View>
        <View style={styles.passwordText}>
          <Text variant="strong" color="black" fontSize={22} fontWeight={'400'} style={styles.inputTitle}>
            Forgot Password
          </Text>
          <Text variant="text" color="black" fontSize={18} fontWeight={'500'} style={styles.inputTitle}>
            Enter your email to reset password.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            EMAIL
          </Text>
          <CustomTextInput
            title="EMAIL"
            value={email}
            placeholder="email@domain.com"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            variant="outline" text='Reset Password' onPress={onResetPassword} fontSize={16} mt={30}
            loading={loading}
          />
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
  container: {flex: 1, backgroundColor: color.white, alignItems: 'center', padding: scaleVertical(25)},
  inputContainer: {paddingVertical: scaleVertical(50), width: '100%'},
  imageView: {
    paddingTop: scaleVertical(50),
    paddingBottom: scaleVertical(30),
  },
  passwordText: {
    alignSelf: 'flex-start',
  },
  icon: {
    width: scale(294),
    height: scaleVertical(168)
  },
  inputTitle: {
    marginTop: scaleVertical(10)
  },
  buttonView: {
    width: '100%',
    paddingTop: scaleVertical(50)
  }
})

export default ForgotPassword;
