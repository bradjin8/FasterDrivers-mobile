import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { color, scale, scaleVertical } from "utils";
import validator from "utils/validation";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../components/index";
import BaseScreen from "../../components/BaseScreen";

const ForgotPassword = ({ navigation }) => {
  const [userName, setUserName] = useState(null)
  const [userError, setUserError] = useState(null)

  const onBlurUser = () => {
    if(!userName) {
      setUserError(true)
    } else if(!validator.email.regEx.test(userName)) {
      setUserError(true)
    } else {
      setUserError(false)
    }
  }

  const onSignIn = () => {
    if(userName && validator.email.regEx.test(userName)) {
      // api call
    } else {
      onBlurUser();
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
          <Text variant="text" color="black" fontSize={22} fontWeight={'600'} style={styles.inputTitle}>
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
            value={userName}
            placeholder="email"
            onChangeText={(text) => setUserName(text)}
            onBlurText={onBlurUser}
            hasError={userError}
            errorMessage={"Enter valid email"}
          />
        </View>
        <View style={styles.buttonView}>
          <Button variant="outline" text='Sign up' onPress={onSignIn} fontSize={16} mt={30} />
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
  container: {flex: 1, backgroundColor: color.white, alignItems: 'center', padding: scaleVertical(25) },
  inputContainer: { paddingVertical: scaleVertical(50), width: '100%' },
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
