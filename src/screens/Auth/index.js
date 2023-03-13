import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { color, scale, scaleVertical } from "utils";
import validator from "utils/validation";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../components/index";
import BaseScreen from "../../components/BaseScreen";
import { loginRequest } from "../../screenRedux/loginRedux";
import { useSelector, useDispatch } from "react-redux"
import { navigate } from "navigation/NavigationService";

const SignIn = ({ route }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [userName, setUserName] = useState(null)
  const [userError, setUserError] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
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

  const onSignIn = () => {
    if(userName && password && validator.email.regEx.test(userName)) {
      let data = new FormData();
      data.append('email', userName);
      data.append('password', password);
      dispatch(loginRequest(data))
    } else {
      onBlurUser();
      onBlurPassword();
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
          <View style={{alignItems: 'flex-end', marginTop: scaleVertical(10)}}>
            <Button variant="link" text='Forgot Password?' fontSize={16} onPress={() => navigate('ForgotPassword')} />
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button loading={loading} text='Sign in' fontSize={16} onPress={onSignIn} />
          <Button variant="outline" text='Sign up' fontSize={16} mt={30} onPress={() => navigate('SignUp', { userType })} />
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

export default SignIn;
