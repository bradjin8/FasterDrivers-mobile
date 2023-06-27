import {navigate} from "navigation/NavigationService";
import React from "react"
import {Image, StyleSheet, View} from "react-native";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {Button} from '../../components/index';

const Onboard = ({}) => {
  return (
    <View style={styles.container}>
      <Image
        source={Images.AppLogo}
        style={styles.icon}
        resizeMode={'contain'}
      />
      <View style={{width: '100%'}}>
        <Button text='Get Started' fontSize={16} onPress={() => navigate("UserSelection")} />
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

export default Onboard;
