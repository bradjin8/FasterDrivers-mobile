import {navigate} from "navigation/NavigationService";
import React from "react"
import {Image, StyleSheet, View} from "react-native";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {Button} from '../../components/index';

const UserSelection = ({}) => {
  const redirectTo = (userType) => {
    navigate("SignIn", {userType})
  }

  return (
    <View style={styles.container}>
      <Image
        source={Images.AppLogo}
        style={styles.icon}
        resizeMode={'contain'}
      />
      <View>
        <Button isSecondary text='Restaurant' fontSize={16} onPress={() => redirectTo("Restaurant")} mt={30} fontWeight="700" />
        <Button isSecondary text='Driver' fontSize={16} onPress={() => redirectTo("Driver")}  mt={30} fontWeight="700" />
        <Button isSecondary text='Customer' fontSize={16} onPress={() => redirectTo("Customer")}  mt={30} fontWeight="700" />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.white, justifyContent: 'space-around', alignItems: 'center', padding: scaleVertical(25) },
  icon: {
    width: scale(294),
    height: scaleVertical(168)
  }
})

export default UserSelection;
