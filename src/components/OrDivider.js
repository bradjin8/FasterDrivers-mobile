import {Text} from "components/text";
import React from 'react'
import {View, StyleSheet} from "react-native"
import {widthPercentageToDP as wp} from "react-native-responsive-screen"

const OrDivider = () => {
  const styles = createStyle()

  return <View style={styles.container}>
    <View style={styles.border}/>
    <Text style={styles.text} color={'item'} fontSize={18}>or</Text>
    <View style={styles.border}/>
  </View>
}

export default OrDivider

const createStyle = () => StyleSheet.create({
  container: {
    width: wp(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  border: {
    height: 1,
    width: wp(36),
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  text: {
    marginHorizontal: wp(4),
    marginBottom: 6,
  }
})
