import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData, screenWidth } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, Button, Text } from "../../../components/index";
import Icon from "react-native-vector-icons/dist/Feather";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantDetails } from "../../../screenRedux/customerRedux";
import { goBack } from "navigation/NavigationService";
import StarRating from "react-native-star-rating-new";
import carDetails from "screens/Driver/Settings/CarDetails";

const RestaurantDetails = ({ route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const restaurantDetails = useSelector(state => state.customerReducer.restaurantDetails);
  const selectedRestaurant = route?.params.restaurant;
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    dispatch(getRestaurantDetails(selectedRestaurant));
  }, []);

  const onAdd = (product) => {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      let _cartItems = [...cartItems]; // copying the old datas array
      _cartItems[index].quantity += 1;
      setCartItems(_cartItems)
    } else {
      setCartItems([
        ...cartItems,
        { ...product, quantity: 1 },
      ]);
    }
  };

  const onRemove = (product) => {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      let _cartItems = [...cartItems]; // copying the old datas array
      if(_cartItems[index].quantity === 0) return
      _cartItems[index].quantity -= 1;
      setCartItems(_cartItems)
    }
  };

  const renderPrice = (item, findIndex) => {
    if(findIndex > -1) {
      return cartItems[findIndex].quantity
    } else {
      return `$ ${item.price}`
    }
  }

  const renderFinalTotal = () => {
    return  cartItems.length && cartItems.reduce((prev,curr) => {
      return prev + (curr.quantity * curr.price)
    }, 0).toFixed(2)
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, flex: 1, marginBottom: -10 }}>
        {loading && <ActivityIndicators />}
        <View>
          <Pressable onPress={() => goBack()} style={styles.backView}>
            <Icon name="arrow-left" size={20} color={color.black} />
          </Pressable>
          <Image source={restaurantDetails?.photo ? { uri: restaurantDetails.photo } : Images.item}
                 style={styles.itemImage} />
        </View>

        <View style={styles.content}>
          <View style={styles.flex}>
            <Text variant="text" color="item" fontSize={14} fontWeight="600">
              {restaurantDetails?.name}
            </Text>
            <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400" numberOfLines={2}
                  ellipsizeMode="tail">
              {restaurantDetails?.street}, {restaurantDetails?.city} - {restaurantDetails?.zip_code}, {restaurantDetails?.state}
            </Text>
          </View>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {restaurantDetails?.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={restaurantDetails?.rating_count}
              starSize={18}
              emptyStarColor={color.lightGray}
              fullStarColor={color.lightGray}
              starStyle={{ color: color.primary, fontWeight: "bold", marginRight: scaleVertical(3) }}
            />
            <Text variant="text" color="item" fontSize={14} fontWeight="600" style={{ marginLeft: scaleVertical(5) }}>
              {restaurantDetails?.rating_count}
            </Text>
          </View>
          <Button style={styles.btnStyle} variant="outline" text="Group Order" textColor="black" onPress={() => {
          }} fontSize={12} />
        </View>

        <View style={styles.itemContainer}>
          {restaurantDetails?.dishes.map((item, i) => {
            const findIndex = cartItems.findIndex((product) => product.id === item.id);
            return (
                <View style={styles.flex} key={i.toString()}>
                  <View>
                    <Text variant="text" color="black" fontSize={12} fontWeight="500">
                      {item?.name}
                    </Text>
                    <Text variant="text" color="black" fontSize={12} fontWeight="300">
                      {item?.description}
                    </Text>
                    <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                      <Pressable onPress={() => onRemove(item)} style={styles.priceButton}>
                        <Icon name="minus" size={15} color={color.black} />
                      </Pressable>
                      <Text variant="text" color="priceText" fontSize={14} fontWeight="400">
                        {renderPrice(item, findIndex)}
                      </Text>
                      <Pressable onPress={() => onAdd(item)} style={[styles.priceButton, {marginLeft: scale(15)}]}>
                        <Icon name="plus" size={15} color={color.black} />
                      </Pressable>
                    </View>
                  </View>
                  <Image source={item?.image_1 ? { uri: item.image_1 } : Images.item}
                         style={styles.itemImageContain} />
                </View>
              );
            },
          )}
        </View>

      </ScrollView>
      <View style={styles.cartView}>
        <View style={styles.cartContain}>
          <Icon name="shopping-cart" size={20} color={color.white} />
          <Text variant="text" color="white" fontSize={14} fontWeight="600">
            View cart
          </Text>
          <Text variant="text" color="white" fontSize={14} fontWeight="600">
            {renderFinalTotal()}
          </Text>
        </View>
      </View>
    </>


  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: { backgroundColor: color.white },
  backView: {
    height: scale(25),
    width: scale(25),
    borderRadius: scale(12.5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
    position: "absolute",
    left: scaleVertical(25),
    top: scaleVertical(10),
    // right: 0,
    zIndex: 11,
  },
  itemImage: {
    width: "100%",
    height: screenWidth / 2.5,
  },
  itemImageContain: {
    width: scaleVertical(80),
    height: scaleVertical(80),
  },
  content: {
    paddingHorizontal: scaleVertical(25),
    paddingVertical: scaleVertical(15),
  },
  itemContainer: {
    flex: 1,
    paddingLeft: scaleVertical(25),
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnStyle: {
    width: scaleVertical(100),
    borderColor: color.black,
    height: scaleVertical(45),
    marginTop: scaleVertical(15),
  },
  cartView: {
    width: "100%",
    height: scaleVertical(40),
    backgroundColor: color.primary,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
  },
  cartContain: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: scale(25),
  },
  priceButton: {backgroundColor: color.slightGray, width: scale(32), height: scaleVertical(18), borderRadius: scaleVertical(4), alignItems: 'center', justifyContent: 'center', marginRight: scale(15)},
});

export default RestaurantDetails;
