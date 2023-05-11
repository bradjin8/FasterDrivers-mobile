import SimpleHeader from "components/SimpleHeader";
import {navigate} from "navigation/NavigationService";
import React from "react";
import {Image, Pressable, StyleSheet, View} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {color, scale} from "utils";
import BaseScreen from "../../../components/BaseScreen";
import {Text} from "../../../components/index";

const ViewDish = ({route}) => {
  const dish = route.params?.dish || {};

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title={dish?.name}
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.image}>
          <Image source={{uri: dish?.image_1}} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
          <Pressable style={styles.edit} onPress={() => navigate("AddNewDish", {dish})}>
            <SimpleLineIcons name={'pencil'} size={scale(14)} color={color.black}/>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text variant='strong' fontSize={14} color='black'>{dish?.name}</Text>
          <Text variant='h5' fontSize={14} color='black'>${dish?.price}</Text>
          <Text variant='text' fontSize={12} color='black'>{dish?.description}</Text>
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
  container: {flex: 1, backgroundColor: color.white},
  image: {
    width: widthPercentageToDP(100),
    height: widthPercentageToDP(75),
    backgroundColor: color.lightGray,
  },
  edit: {
    position: 'absolute',
    top: widthPercentageToDP(2),
    right: widthPercentageToDP(2),
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    borderRadius: widthPercentageToDP(4),
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: color.white,
  },
  body: {
    padding: widthPercentageToDP(4)
  }
})

export default ViewDish;
