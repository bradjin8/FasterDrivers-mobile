import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import validator from "utils/validation";
import SimpleHeader from "components/SimpleHeader";

const AccountInformation = ({ navigation }) => {
  const [userName, setUserName] = useState(null)
  const [userError, setUserError] = useState(null)
  const [email, setEmail] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [phone, setPhone] = useState(null)
  const [phoneError, setPhoneError] = useState(null)
  
  const redirectTo = (userType) => {
    navigation.navigate("RestaurantProfile", {userType})
  }
  
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
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="My Account"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <TouchableHighlight style={styles.imageButton}>
          <Image source={Images.Capture} style={styles.icon} />
        </TouchableHighlight>
        
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
            value={phone}
            onChangeText={(text) => setPhone(text)}
            onBlurText={onBlurUser}
            hasError={phoneError}
            errorMessage={"Enter phone number"}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}}>
          <Button text='Save' fontSize={16} onPress={() => {}}  mt={30} fontWeight="700" />
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

export default AccountInformation;
