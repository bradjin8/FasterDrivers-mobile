import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, ScrollView, Pressable, ActivityIndicator} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical, restaurantSettingData} from "utils";
import {Images} from "src/theme"
import {ActivityIndicators, Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import {navigate} from "navigation/NavigationService";
import {getDishesRequest} from "../../../screenRedux/restaurantRedux";

const Menu = ({navigation}) => {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState(null);
  const {loading, dishes} = useSelector(state => state.restaurantReducer)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getDishesRequest())
    });
    // dispatch(getDishesRequest())
    return unsubscribe;
  }, [])

  if (loading)
    return <ActivityIndicators/>

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Menu"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{paddingBottom: scaleVertical(10)}}>
          <CustomTextInput
            value={searchValue}
            placeholder="Search dishes"
            onChangeText={(text) => setSearchValue(text)}
          />
        </View>

        <View style={styles.titleView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Dishes
          </Text>
          <View style={styles.btnView}>
            <Button loading={false} text='Add New' fontSize={16} height={30} onPress={() => navigate("AddNewDish")}/>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {dishes && dishes.map((item, index) => (
            <View key={index} style={styles.listContain}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 50, height: 50, backgroundColor: color.lightGray}}>
                  <Image source={{uri: item.image_1}} style={{width: 50, height: 50}}/>
                </View>
                <View style={styles.inputTitle}>
                  <Text variant="h5" color="black" fontSize={14} fontWeight="600">
                    {item.name}
                  </Text>
                  <Text variant="text" color="black" fontSize={12} fontWeight="400">
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Pressable onPress={() => navigate("ViewDish", {item})}>
                  <Image source={Images.ThreeDots} style={{width: 20, height: 20}} resizeMode={'contain'}/>
                </Pressable>
                <Text variant="h5" color="black" fontSize={14} fontWeight="400">
                  ${item.price}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  btnView: {width: scale(100)},
  titleView: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},

  scrollContainer: {flex: 1, paddingVertical: scaleVertical(10)},
  listContain: {
    flexDirection: 'row',
    paddingVertical: scaleVertical(16),
    justifyContent: 'space-between'
  },
  inputTitle: {
    paddingHorizontal: scaleVertical(20)
  },
  nextArrow: {width: 10, height: 10},
})

export default Menu;
