import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, ScrollView, Pressable, ActivityIndicator, FlatList} from "react-native";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical, restaurantSettingData} from "utils";
import {Images} from "src/theme"
import {truncateString} from "utils/utils";
import {ActivityIndicators, Button, CustomTextInput, Text} from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import {navigate} from "navigation/NavigationService";
import {getDishesRequest} from "../../../screenRedux/restaurantRedux";

const Menu = ({navigation, route}) => {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState(null);
  const {loading, dishes} = useSelector(state => state.restaurantReducer)

  // console.log('dishes', dishes)

  const fetchDishes = () => {
    dispatch(getDishesRequest())
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDishes()
    });
    // dispatch(getDishesRequest())
    return unsubscribe;
  }, [])

  const filterDishes = () => {
    if (searchValue) {
      return dishes.filter(item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
        || item.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    } else {
      return dishes
    }
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Menu"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{paddingBottom: scaleVertical(10)}}>
          <CustomTextInput
            isImages={true}
            value={searchValue}
            placeholder="Search dishes"
            onChangeText={(text) => setSearchValue(text)}
          />
        </View>

        <View style={styles.titleView}>
          <Text variant="strong" color="black" fontSize={14} fontWeight="600">
            Dishes
          </Text>
          <View style={styles.btnView}>
            <Button loading={false} text='Add New' fontSize={16} height={30} onPress={() => navigate("AddNewDish")}/>
          </View>
        </View>
      </View>

      <View style={styles.scrollContainer}>
        <FlatList
          data={filterDishes()}
          renderItem={({item, index}) => {
            return (<View key={index} style={styles.listContain}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.image}>
                  <Image source={{uri: item.image_1}} style={styles.image}/>
                </View>
                <View style={styles.inputTitle}>
                  <Text variant="h5" color="black" fontSize={12} fontWeight="600">
                    {item.name}
                  </Text>
                  <Text variant="text" color="black" fontSize={10} lineHeight={12} fontWeight="400">
                    {truncateString(item.description, 100)}
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
            </View>)
          }}
          refreshing={loading}
          onRefresh={fetchDishes}
          ListEmptyComponent={() => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text variant="h5" color="black" fontSize={14} fontWeight="400">
              No dishes found
            </Text>
          </View>}
        />
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

  scrollContainer: {
    minHeight: heightPercentageToDP(50),
    paddingVertical: scaleVertical(10),
  },
  listContain: {
    flexDirection: 'row',
    paddingVertical: scaleVertical(2),
    justifyContent: 'space-between',
    paddingRight: scaleVertical(25),

  },
  image: {width: widthPercentageToDP(14), height: widthPercentageToDP(14), backgroundColor: color.lightGray},
  inputTitle: {
    paddingHorizontal: scaleVertical(10),
    width: widthPercentageToDP(65),
  },
  nextArrow: {width: 10, height: 10},
})

export default Menu;
