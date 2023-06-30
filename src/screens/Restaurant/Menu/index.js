import SimpleHeader from "components/SimpleHeader";
import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {FlatList, Image, Pressable, SafeAreaView, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {truncateString} from "utils/utils";
import {Button, CustomTextInput, Text} from "../../../components/index";
import {ORDER_STATUS} from "../../../consts/orders";
import {getDishesRequest, viewMyOrdersRequest} from "../../../screenRedux/restaurantRedux";

const Menu = ({navigation, route}) => {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('');
  const {loading, dishes} = useSelector(state => state.restaurantReducer)
  const {accessToken, user: {restaurant: restaurant}} = useSelector(state => state.loginReducer)

  const fetchDishes = () => {
    dispatch(getDishesRequest())
  }

  useEffect(() => {
    const checkStatus = () => {
      if (restaurant?.name) {
        if (restaurant.subscription) {
          fetchDishes()
        } else {
          showMessage({
            message: 'You need to subscribe to view this page',
            type: 'info',
            icon: 'info',
          })
          navigation.navigate('Settings', {screen: 'Subscription'})
        }
      } else {
        showMessage({
          message: 'Please configure your restaurant details first',
          type: 'info',
          icon: 'info',
        })
        navigation.navigate('Settings', {screen: 'RestaurantProfile'})
      }
    }

    const unsubscribe = navigation.addListener('focus', () => {
      checkStatus()
    })
    return () => {
      unsubscribe()
    }
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
    <SafeAreaView style={styles.mainWrapper}>
      <SimpleHeader
        title="Menu"
        showBackIcon={true}
      />
      <View style={{
        padding: scaleVertical(25),
        paddingTop: scaleVertical(0),
      }}>
        <CustomTextInput
          isImages
          value={searchValue}
          placeholder="Search dishes"
          onChangeText={(text) => setSearchValue(text)}
        />
      </View>
      <View style={styles.titleView}>
        <Text variant="strong" color="item" fontSize={14} fontWeight="600">
          {filterDishes().length} Dishes
        </Text>
        <View style={styles.btnView}>
          <Button text='Add New' fontSize={16} height={30} onPress={() => navigate("AddNewDish")}/>
        </View>
      </View>
      <FlatList
        data={filterDishes()}
        style={styles.list}
        renderItem={({item, index}) => {
          return (<Pressable key={index} style={styles.listContain} onPress={() => navigate("ViewDish", {dish: item})}>
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
              <View>
                <Entypo name={'dots-three-horizontal'} size={20} color={color.item}/>
              </View>
              <Text variant="h5" color="black" fontSize={14} fontWeight="400">
                ${item.price}
              </Text>
            </View>
          </Pressable>)
        }}
        refreshing={loading}
        onRefresh={fetchDishes}
        ListEmptyComponent={() => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text variant="h5" color="itemPrimary" fontSize={14} fontWeight="400">
            No dishes found
          </Text>
        </View>}
      />

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  btnView: {width: scale(100)},
  titleView: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: scale(25),
  },
  list: {
    minHeight: heightPercentageToDP(50),
    // flexGrow: 0,
  },
  listContain: {
    flexDirection: 'row',
    marginVertical: scaleVertical(5),
    justifyContent: 'space-between',
    paddingRight: scaleVertical(25),
    backgroundColor: color.white,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: color.lightGray,
  },
  image: {width: widthPercentageToDP(14), height: widthPercentageToDP(14), backgroundColor: color.lightGray},
  inputTitle: {
    paddingHorizontal: scaleVertical(10),
    width: widthPercentageToDP(65),
  },
  nextArrow: {width: 10, height: 10},
})

export default Menu;
