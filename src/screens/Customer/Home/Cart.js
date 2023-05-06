import SimpleHeader from "components/SimpleHeader";
import React, {useState} from "react";
import {Image, ScrollView, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme";
import {color, scale, scaleVertical} from "utils";
import {ActivityIndicators, Button, CustomTextInput, Text} from "../../../components/index";
import {createNewOrder} from "../../../screenRedux/customerRedux";

const Cart = () => {
  const dispatch = useDispatch();
  const {loading, carts, addresses,} = useSelector(state => state.customerReducer);
  const [searchText, setSearchText] = useState(null);
  const defaultAddress = addresses?.find(o => o.default)
  const {street, state, zip_code} = defaultAddress || {}

  const createOrder = () => {
    if (!defaultAddress)
      return showMessage({
        message: "Please set default address",
        type: "danger",
      });

    let data = new FormData();
    data.append('restaurant', carts[0].restaurant);

    if (defaultAddress) {
      data.append('address', defaultAddress.id);
    }
    carts.map((item, index) => {
      data.append(`dishes[${index}]dish`, item.id);
      data.append(`dishes[${index}]quantity`, item.quantity);
      // item.addons?.map((addon, idx) => {
      //   data.append(`dishes[${index}]dish_addons[${idx}]item`, addon.id);
      //   data.append(`dishes[${index}]dish_addons[${idx}]quantity`, addon.quantity);
      // })
    })

    dispatch(createNewOrder(data))
  }

  const renderFinalTotal = () => {
    return carts.length && carts.reduce((prev, curr) => {
      return prev + (curr.quantity * curr.price)
    }, 0).toFixed(2)
  }

  const renderHeader = (cart, index) => {
    const {image_1, quantity, name, description, price} = cart
    return (
      <View style={styles.itemContain} key={index.toString()}>
        <View style={styles.flexRow}>
          <Image source={image_1 ? {uri: image_1} : Images.item} style={styles.downIcon}/>
          <View style={{width: "72%"}}>
            <Text variant="text" color="black" fontSize={12} fontWeight="500">
              <Text variant="text" color="primary" fontSize={12} fontWeight="500">
                {quantity > 1 && quantity + "x "}
              </Text>{name}
            </Text>
            <Text variant="text" color="black" fontSize={12} fontWeight="300" numberOfLines={2}
                  ellipsizeMode="tail">
              {description}
            </Text>
          </View>
        </View>
        <View style={{width: "20%", alignItems: "center"}}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">
            ${(price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Price</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">${renderFinalTotal()}</Text>
        </View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Fee</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">$0.00</Text>
        </View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Total</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">${renderFinalTotal()}</Text>
        </View>
        <View style={styles.items}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Address
          </Text>
        </View>

        <View style={[styles.instructionView, {flexDirection: "row", justifyContent: "space-between"}]}>
          <View style={{width: "60%"}}>
            <Text variant="text" color="black" fontSize={12} fontWeight="400" numberOfLines={2} ellipsizeMode="tail">
              {street}, {state} - {zip_code}
            </Text>
          </View>
          <Button loading={false} text="Other"
                  style={styles.btnOther} fontSize={16}
                  onPress={() => {
                  }}/>
        </View>

        <View style={styles.instructionView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">
            Special instructions
          </Text>
          <CustomTextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            multiline={true}
          />
          <Button loading={loading} text="Confirm" fontSize={18} fontWeight={'600'} onPress={createOrder}/>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="My Basket"
        showBackIcon={true}
      />
      <ScrollView style={styles.container}>
        <View style={styles.items}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Items
          </Text>
        </View>

        <View style={styles.itemContainer}>
          {carts?.map((cart, index) => renderHeader(cart, index))}
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {flex: 1, backgroundColor: color.white},
  items: {
    backgroundColor: color.secondary,
    padding: scale(12),
    width: "100%",
  },
  itemContainer: {
    paddingVertical: scaleVertical(15),
  },
  itemContain: {
    paddingVertical: scaleVertical(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    width: "80%",
    overflow: "hidden",
  },
  downIcon: {
    width: scaleVertical(60),
    height: scaleVertical(60),
    marginRight: scale(10),
  },
  pricingView: {
    paddingHorizontal: scaleVertical(15),
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: scaleVertical(3),
  },
  instructionView: {
    paddingHorizontal: scaleVertical(15),
    marginVertical: scaleVertical(3),
    paddingVertical: scaleVertical(10),
    marginBottom: scale(10),
  },
  btnOther: {width: "25%", backgroundColor: color.black, height: scaleVertical(45)},
});

export default Cart;
