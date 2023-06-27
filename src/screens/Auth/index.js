import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {Image, Platform, Pressable, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux"
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {toFormData} from "utils/useForm";
import validator from "utils/validation";
import BaseScreen from "src/components/BaseScreen";
import {Button, CustomTextInput, Text} from "src/components/index";
import {loginRequest, loginWithFacebook, loginWithGoogle, requestFailed} from "src/screenRedux/loginRedux";
import {Flex, Margin, Size} from "src/theme/Styles";
import {authorizeWithApple} from "src/third-party/apple";
import {authorizeWithFB} from "src/third-party/facebook";
import {authorizeWithGoogle} from "../../third-party/google";

const SignIn = ({route}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [userName, setUserName] = useState(null)
  const [userError, setUserError] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const userType = route?.params.userType;


  const loginWithSocial = async (type) => {
    try {
      switch (type) {
        case 'facebook':
          const access_token = await authorizeWithFB()
          console.log('fb-access_token', access_token)
          if (access_token) {
            dispatch(loginWithFacebook(toFormData({access_token, type: userType})))
          }
          break
        case 'apple':
          console.log(Platform.OS)
          const apple_access_token = await authorizeWithApple()
          console.log('apple-access_token', apple_access_token)
          // if (apple_access_token) {
          //   dispatch(loginWithFacebook(toFormData({access_token: apple_access_token, type: userType})))
          // }
          break
        case 'google':
          const google_access_token = await authorizeWithGoogle()
          console.log('google-access_token', google_access_token)
          if (google_access_token) {
            dispatch(loginWithGoogle(toFormData({access_token: google_access_token, type: userType})))
          }
          break
      }
    } catch (e) {
      console.log('social-auth-error', e.message)
    }
  }

  const onBlurUser = () => {
    if (!userName) {
      setUserError(true)
    } else if (!validator.email.regEx.test(userName)) {
      setUserError(true)
    } else {
      setUserError(false)
    }
  }

  const onBlurPassword = () => {
    if (!password) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }

  const onSignIn = () => {
    if (userName && password && validator.email.regEx.test(userName)) {
      let data = new FormData();
      data.append('email', userName);
      data.append('password', password);
      dispatch(loginRequest(data))
    } else {
      onBlurUser();
      onBlurPassword();
    }
  }

  useEffect(() => {
    dispatch(requestFailed())
  }, [])

  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.imageView}>
          <Image
            source={Images.AppLogo}
            style={styles.icon}
            resizeMode="contain"
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
            <Button variant="link" text='Forgot Password?' fontSize={16} onPress={() => navigate('ForgotPassword')}/>
          </View>
          <View style={[Flex.itemsCenter, Margin.t10]}>
            <Text fontWeight={'600'} color={'primary'}>OR</Text>
            <Text>Sign in with Social Media</Text>
            <View style={[Flex.row, Flex.justifyEvenly, Margin.t10]}>
              <Pressable onPress={() => loginWithSocial('google')}>
                <Image source={Images.IcGoogle} style={[Size.h50, Size.w50]}/>
              </Pressable>
              <Pressable onPress={() => loginWithSocial('apple')}>
                <Image source={Images.IcApple} style={[Size.h50, Size.w50]}/>
              </Pressable>
              <Pressable onPress={() => loginWithSocial('facebook')}>
                <Image source={Images.IcFacebook} style={[Size.h50, Size.w50]}/>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button loading={loading} text='Sign in' fontSize={16} onPress={onSignIn}/>
          <Button variant="outline" text='Sign up' fontSize={16} mt={30} onPress={() => navigate('SignUp', {userType})}/>
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
  imageView: {
    paddingTop: scaleVertical(20),
    paddingBottom: scaleVertical(20),
  },
  icon: {
    width: scale(240),
    height: scaleVertical(120)
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
