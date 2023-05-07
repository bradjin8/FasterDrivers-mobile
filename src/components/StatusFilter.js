import React from 'react'
import {View, StyleSheet, Button, Pressable} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {color} from "../utils/color"
import {Text} from "./text";

const StatusFilter = ({status, changeStatus}) => {

  return (
    <View style={styles.container}>
      {['New Orders', 'In Progress', 'Completed'].map((it, id) => (
        <Pressable key={id} style={id !== status ? styles.item : styles.itemActive} onPress={() => changeStatus(id)}>
          <Text
            color={status === id ? color.white : color.black}
          >
            {it}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

export default StatusFilter

const styles = StyleSheet.create({
  container: {
    width: widthPercentageToDP(100),
    flexDirection: 'row',
  },
  item: {
    padding: 3,
    borderColor: color.black,
    borderWidth: 1,
    width: widthPercentageToDP(33)
  },
  itemActive: {
    padding: 3,
    borderColor: color.primary,
    borderWidth: 1,
    width: widthPercentageToDP(34),
    backgroundColor: color.primary
  }
})
