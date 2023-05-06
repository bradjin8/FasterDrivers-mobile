import React, {useEffect, useState} from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {color, scale, scaleVertical, screenWidth} from "utils";
import {Images} from "src/theme";
import {ActivityIndicators, Button, Text} from "../../../components/index";
import Icon from "react-native-vector-icons/dist/Feather";
import {useDispatch, useSelector} from "react-redux";
import {getRestaurantDetails, setUserCartItems} from "../../../screenRedux/customerRedux";
import {goBack, navigate} from "navigation/NavigationService";
import StarRating from "react-native-star-rating-new";
import _ from 'lodash'

const RestaurantDetails = ({route}) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const restaurantDetails = useSelector(state => state.customerReducer.restaurantDetails);
  const selectedRestaurant = route?.params.restaurant;
  const cartItemsReducer = useSelector(state => state.customerReducer.carts)
  const [cartItems, setCartItems] = useState(cartItemsReducer)
  const {id, photo, name, street, city, zip_code, state, description, type, rating_count} = selectedRestaurant
  const [rating, setRating] = useState(rating_count)

  useEffect(() => {
    dispatch(getRestaurantDetails(id));
  }, []);

  useEffect(() => {
    setCartItems(cartItemsReducer)
  }, [cartItemsReducer]);

  const handleRating = (rate) => {
    setRating(rate)
  }

  const onAdd = (product) => {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      let _cartItems = _.cloneDeep(cartItems);
      _cartItems[index].quantity += 1;
      dispatch(setUserCartItems(_cartItems))
    } else {
      dispatch(setUserCartItems([
        ...cartItems,
        {...product, quantity: 1},
      ]))
    }
  };

  const onRemove = (product) => {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      let _cartItems = _.cloneDeep(cartItems);
      if (_cartItems[index].quantity === 1) {
        _cartItems.splice(index, 1);
        dispatch(setUserCartItems(_cartItems))
        return
      }
      _cartItems[index].quantity -= 1;
      dispatch(setUserCartItems(_cartItems))
    }
  };

  const renderPrice = (item, findIndex) => {
    if (findIndex > -1) {
      if (cartItems[findIndex].quantity === 0) return `$ ${item.price}`
      return cartItems[findIndex].quantity
    } else {
      return `$ ${item.price}`
    }
  }

  const renderFinalTotal = () => {
    return cartItems.length && cartItems.reduce((prev, curr) => {
      return prev + (curr.quantity * curr.price)
    }, 0).toFixed(2)
  }

  const renderItems = (item, i) => {
    const findIndex = cartItems.findIndex((product) => product.id === item.id);
    return (
      <View style={styles.flex} key={"item-" + i.toString()}>
        <View style={styles.itemDetails}>
          <Text variant="text" color="black" fontSize={12} fontWeight="500">
            {item?.name}
          </Text>
          <Text variant="text" color="black" fontSize={12} fontWeight="300">
            {item?.description}
          </Text>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <Pressable onPress={() => onRemove(item)} style={styles.priceButton}>
              <Icon name="minus" size={15} color={color.black}/>
            </Pressable>
            <Text variant="text" color="priceText" fontSize={14} fontWeight="400">
              {renderPrice(item, findIndex)}
            </Text>
            <Pressable onPress={() => onAdd(item)} style={[styles.priceButton, {marginLeft: scale(15)}]}>
              <Icon name="plus" size={15} color={color.black}/>
            </Pressable>
          </View>
        </View>
        <Image source={item?.image_1 ? {uri: item.image_1} : Images.item}
               style={styles.itemImageContain}/>
      </View>
    )
  }

  const renderDishes = () => {
    const keys = Object.keys(restaurantDetails || {});
    if (keys.length === 0) {
      return <View>
        <Text variant="text" color="black" style={styles.noData}>
          No data found
        </Text>
      </View>
    }

    return (
      keys.map((type, index) => {
        return (
          <View key={'dish-' + index}>
            <View style={styles.itemTitle}>
              <Text variant="text" color="secondaryBtn" fontSize={14} fontWeight="600">
                {type}
              </Text>
            </View>
            {restaurantDetails[type].map((item, i) => renderItems(item, i))}
          </View>
        )
      })
    )
  }

  if (loading) {
    return (<ActivityIndicators/>)
  }
  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: heightPercentageToDP(10),
        }}>
        <View>
          <Pressable onPress={() => goBack()} style={styles.backView}>
            <Icon name="arrow-left" size={20} color={color.black}/>
          </Pressable>
          <Image source={photo ? {uri: photo} : Images.item}
                 style={styles.itemImage}/>
        </View>

        <View style={styles.content}>
          <View style={styles.flex}>
            <Text variant="text" color="item" fontSize={14} fontWeight="600">
              {name}
            </Text>
            <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400" numberOfLines={2}
                  ellipsizeMode="tail">
              {street}, {city} - {zip_code}, {state}
            </Text>
          </View>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {description}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {type}
          </Text>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={rating}
              starSize={18}
              emptyStarColor={color.lightGray}
              fullStarColor={color.primary}
              containerStyle={styles.starContainer}
              starStyle={styles.starStyle}
              selectedStar={(rating) => handleRating(rating)}
            />
            <Text variant="text" color="item" fontSize={14} fontWeight="600" style={{marginLeft: scaleVertical(5)}}>
              {rating}
            </Text>
          </View>
          <Button style={styles.btnStyle} variant="outline" text="Group Order" textColor="black" onPress={() => {
          }} fontSize={12}/>
        </View>

        <View style={styles.itemContainer}>
          {renderDishes()}
        </View>
      </ScrollView>
      <View style={styles.cartView}>
        <View style={styles.cartContain}>
          <View>
            {cartItems.length ? <View style={styles.circle}>
              <Text variant="text" color="white" fontSize={12} fontWeight="600">
                {cartItems.length}
              </Text>
            </View> : null}
            <Icon name="shopping-cart" size={20} color={color.white}/>
          </View>
          <Pressable onPress={() => navigate("Cart")}>
            <Text variant="text" color="white" fontSize={14} fontWeight="600">
              View cart
            </Text>
          </Pressable>
          <Text variant="text" color="white" fontSize={14} fontWeight="600">
            {renderFinalTotal()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {backgroundColor: color.white},
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
  circle: {
    position: 'absolute',
    right: -20,
    top: -8,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    zIndex: 1,
    borderColor: color.white,
    borderWidth: scale(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.angry
  },
  itemTitle: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: scaleVertical(10)},
  itemDetails: {
    width: widthPercentageToDP(60),
  },
  noData: {textAlign: 'center', marginTop: scaleVertical(20)},
  starContainer: {width: 100, justifyContent: "space-evenly"},
  starStyle: {marginRight: scaleVertical(3), margin: 3}
});

export default RestaurantDetails;
