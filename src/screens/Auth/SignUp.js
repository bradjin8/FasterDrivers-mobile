import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { color, scale, scaleVertical } from "utils";
import validator from "utils/validation";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../components/index";
import BaseScreen from "../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { signUpRequestStarted } from "../../screenRedux/loginRedux";

const SignUp = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [userName, setUserName] = useState("test@gmail.com")
  const [userError, setUserError] = useState(null)
  const [password, setPassword] = useState("test@123")
  const [passwordError, setPasswordError] = useState(null)
  const [rePassword, setRePassword] = useState("test@123")
  const [rePasswordError, setRePasswordError] = useState(null)
  const userType = route?.params.userType;

  const onBlurUser = () => {
    if(!userName) {
      setUserError(true)
    } else if(!validator.email.regEx.test(userName)) {
      setUserError(true)
    } else {
      setUserError(false)
    }
  }

  const onBlurPassword = () => {
    if(!password) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }
  const onBlurRePassword = () => {
    if(!rePassword || rePassword !== password) {
      setRePasswordError(true)
    } else {
      setRePasswordError(false)
    }
  }

  const onSignUp = () => {
    if(userName && validator.email.regEx.test(userName) && password && rePassword === password) {
      let data = new FormData();
      data.append('email', userName);
      data.append('password', password);
      data.append('type', userType);
      dispatch(signUpRequestStarted(data))
    } else  {
      onBlurUser();
      onBlurPassword();
      onBlurRePassword();
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
        <View style={{width: '100%'}}>
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
          <Text variant="text" color="black" style={styles.inputTitle}>
            Password
          </Text>
          <CustomTextInput
            secureTextEntry
            title="PASSWORD"
            value={password}
            placeholder="********"
            onBlurText={onBlurPassword}
            onChangeText={(text) => setPassword(text)}
            hasError={passwordError}
            errorMessage={"Enter password"}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Repeat Password
          </Text>
          <CustomTextInput
            secureTextEntry
            title="Repeat Password"
            value={rePassword}
            placeholder="********"
            onBlurText={onBlurRePassword}
            onChangeText={(text) => setRePassword(text)}
            hasError={rePasswordError}
            errorMessage={"Enter Repeat password"}
          />
        </View>
        <View style={styles.buttonView}>
          <Button loading={loading} variant="outline" text='Sign up' onPress={onSignUp} fontSize={16} mt={30} />
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
  imageView: {
    paddingTop: scaleVertical(50),
    paddingBottom: scaleVertical(30),
  },
  icon: {
    width: scale(294),
    height: scaleVertical(168)
  },
  inputTitle: {
    marginTop: scaleVertical(7.5)
  },
  buttonView: {
    width: '100%',
    paddingTop: scaleVertical(50)
  }
})

export default SignUp;
