import React from "react"
import {Text} from "components/text";
import {Image, Linking, Pressable, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {color, scale} from "../utils"

const DriverCard = ({driver}) => {

  return (<View style={styles.driverContainer}>
    <View style={styles.row}>
      <Image source={{uri: driver?.driver?.photo}} style={styles.avatar} resizeMode={'cover'}/>
      <View style={styles.column}>
        <Text color={'itemPrimary'} fontSize={12} variant={'h5'}>Courier</Text>
        <Text variant={'strong'}>{driver?.name}</Text>
      </View>
    </View>
    <Pressable style={styles.phone} onPress={() => {
      const url = `tel:${driver?.driver?.phone}`
      Linking.openURL(url)
        .then((res) => {
          if (!res)
            showMessage({
              message: 'Driver does not have a phone number',
              type: 'danger',
            })
        })
    }}>
      <FontAwesome name={'phone'} size={scale(14 )} color={color.white}/>
    </Pressable>
  </View>)
}

export default DriverCard

const styles = StyleSheet.create({
  driverContainer: {
    width: '100%',
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row'
  },
  avatar: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: wp(3),
  },
  phone: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
