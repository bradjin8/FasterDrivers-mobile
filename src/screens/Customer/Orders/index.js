import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, Button, CustomTextInput, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "navigation/NavigationService";

const Orders = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const cartItemsReducer = useSelector(state => state.customerReducer.carts)
  const [cartItems, setCartItems] = useState(cartItemsReducer)
  const [searchText, setSearchText] = useState(null);
  const addresses = useSelector(state => state.customerReducer.addresses);
  const defaultAddress = addresses?.find(o => o.default)
  const { street, state, zip_code } = defaultAddress || {}

  useEffect(() => {
    setCartItems(cartItemsReducer)
  }, [cartItemsReducer]);

  const renderFinalTotal = () => {
    return  cartItems.length && cartItems.reduce((prev,curr) => {
      return prev + (curr.quantity * curr.price)
    }, 0).toFixed(2)
  }

  const renderHeader = (cart, index) => {
    const { image_1, quantity, name, description, price } = cart
    return (
      <View style={styles.itemContain} key={index.toString()}>
        <View style={styles.flexRow}>
          <Image source={image_1 ? {uri: image_1} : Images.item} style={styles.downIcon} />
          <View style={{ width: "72%" }}>
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
        <View style={{ width: "20%", alignItems: "center" }}>
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

        <View style={[styles.instructionView, { flexDirection: "row", justifyContent: "space-between" }]}>
          <View style={{ width: "60%" }}>
            <Text variant="text" color="black" fontSize={12} fontWeight="400" numberOfLines={2} ellipsizeMode="tail">
              {street}, {state} - {zip_code}
            </Text>
          </View>
          <Button loading={false} text="Other"
                  style={styles.btnOther} fontSize={16}
                  onPress={() => {
                  }} />
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
          <Button loading={false} text="Confirm" onPress={() => navigate("Payment")} />
        </View>
      </View>
    );
  };
  
  if(loading) {
    return (<ActivityIndicators />)
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="My Basket"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.items}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Items
          </Text>
        </View>

        <View style={styles.itemContainer}>
          {cartItems?.map((cart, index) => renderHeader(cart, index))}
          {renderContent()}
        </View>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: { flex: 1, backgroundColor: color.white },
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
  btnOther: { width: "25%", backgroundColor: color.black, height: scaleVertical(45) },
});

export default Orders;
