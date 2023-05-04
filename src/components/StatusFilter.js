import React from 'react'
import {View, StyleSheet, Button} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {color} from "../utils/color"

const StatusFilter = ({status, changeStatus}) => {

  return (
    <View style={styles.container}>
      {['New Orders', 'In Progress', 'Completed'].map((it, id) => (
        <View key={id} style={id !== status ? styles.item : styles.itemActive}>
          <Button
            title={it}
            onPress={() => changeStatus(id)}
            color={status === id ? color.white : color.black}
            style={{fontFamily: 'Lato-Regular'}}
          />
        </View>
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
    paddingVertical: 3,
    borderColor: color.black,
    borderWidth: 1,
    width: widthPercentageToDP(33)
  },
  itemActive: {
    paddingVertical: 3,
    borderColor: color.primary,
    borderWidth: 1,
    width: widthPercentageToDP(34),
    backgroundColor: color.primary
  }
})
