import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { color, scaleVertical } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Button, CustomTextInput, Text } from "../../../components/index";
import { useDispatch, useSelector } from "react-redux";
import validator from "utils/validation";
import { loginRequest } from "../../../screenRedux/loginRedux";
import BaseScreen from "components/BaseScreen";
import { navigate } from "navigation/NavigationService";

const SendFeedback = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [userName, setUserName] = useState(null)
  const [userError, setUserError] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  
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
      // dispatch(loginRequest(data))
    } else {
      onBlurUser();
      onBlurPassword();
    }
  }
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Send Feedback"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Title
          </Text>
          <CustomTextInput
            value={userName}
            placeholder="Feedback Subject"
            onChangeText={(text) => setUserName(text)}
            onBlurText={onBlurUser}
            hasError={userError}
            errorMessage={"Enter valid subject"}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            Message Content
          </Text>
          <CustomTextInput
            value={password}
            placeholder="Message Content"
            onBlurText={onBlurPassword}
            onChangeText={(text) => setPassword(text)}
            hasError={passwordError}
            multiline={true}
            style={{textAlignVertical: 'top'}}
            errorMessage={"Enter valid message content"}
          />
        </View>
        <View style={styles.buttonView}>
          <Button loading={loading} text='Send Feedback' fontSize={16} onPress={onSignIn} />
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
  inputTitle: {
    marginTop: scaleVertical(7.5)
  },
  buttonView: {
    width: '100%',
    paddingTop: scaleVertical(50)
  }
})

export default SendFeedback;


