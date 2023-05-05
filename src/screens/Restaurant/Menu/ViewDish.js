import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, ScrollView, Pressable, ActivityIndicator} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical, restaurantSettingData} from "utils";
import {Images} from "src/theme"
import {ActivityIndicators, Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import {navigate} from "navigation/NavigationService";
import {getDishesRequest} from "../../../screenRedux/restaurantRedux";

const ViewDish = ({route}) => {
  const {item} = route?.params;

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title={item?.name}
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.image}>
          <Image source={{uri: item?.image_1}} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
          <Pressable style={styles.edit} onPress={() => {}}>
            <Image source={Images.Pencil} style={{width: '50%', height: '50%'}} resizeMode={'contain'}/>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text variant='strong' fontSize={14} color='black'>{item?.name}</Text>
          <Text variant='h5' fontSize={14} color='black'>${item?.price}</Text>
          <Text variant='text' fontSize={12} color='black'>{item?.description}</Text>
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
