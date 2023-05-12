import React from 'react'
import {Image, StyleSheet, View} from "react-native"
import {widthPercentageToDP} from "react-native-responsive-screen"
import {Images} from "../theme"
import {color} from "../utils/color"
import {scale} from "../utils/scale"
import {Text} from '../components/text'

const DriverHeader = ({photo, name}) => {
  return <View style={styles.header}>
    <Image source={{uri: photo}} style={{width: scale(34), height: scale(34), borderRadius: scale(17)}}/>
    <Text style={styles.name} color={'gray'} fontSize={12} variant={'strong'}>{name}</Text>
    <View style={styles.logoContainer}>
      <Image source={Images.Logo} style={styles.logo}/>
      <Text variant={'h5'} color={'primary'} fontWeight={'700'}>Fast Drivers</Text>
    </View>
  </View>
}

export default DriverHeader

const styles = StyleSheet.create({
  header: {
    height: scale(60),
    backgroundColor: color.white,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(20),
    position: 'relative'
  },
  name: {
    paddingLeft: scale(10)
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: widthPercentageToDP(50) - scale(17),
    height: scale(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    // width: scale(60),
    height: scale(34),
    width: scale(34),
    resizeMode: 'contain'
  },
})
