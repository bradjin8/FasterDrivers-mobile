import React from "react"
import { StyleSheet, View, Text, Image } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import { Button } from '../../components/index';

const AddDish = ({ navigation }) => {
  const redirectTo = (userType) => {
    navigation.navigate("RestaurantProfile", {userType})
  }
  
  return (
    <View style={styles.container}>
      <Image
        source={Images.AppLogo}
        style={styles.icon}
      />
      <View>
        <Button isSecondary text='Restaurant' fontSize={16} onPress={() => redirectTo("Restaurant")} mt={30} fontWeight="700" />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.white, justifyContent: 'space-around', alignItems: 'center'},
  icon: {
    width: scale(294),
    height: scaleVertical(168)
  }
})

export default AddDish;
