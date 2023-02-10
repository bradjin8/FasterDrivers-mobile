import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, Button, CustomTextInput, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsData } from "../../../screenRedux/customerRedux";
import { navigate } from "navigation/NavigationService";

const Orders = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const user = useSelector(state => state.loginReducer.user);
  const restaurants = useSelector(state => state.customerReducer.restaurants);
  const [searchtext, setSearchText] = useState(null);
  const [activeSections, setActiveSections] = useState([]);

  useEffect(() => {
    dispatch(getRestaurantsData());
  }, []);

  const onBlurSearch = () => {

  };

  const renderSectionTitle = (section) => {
    return (
      <View style={styles.itemContain}>
        <View style={styles.flexRow}>
          <Image source={Images.item} style={styles.downIcon} />
          <View style={{ width: "72%" }}>
            <Text variant="text" color="black" fontSize={12} fontWeight="500">
              2x Double Cheeseburger
            </Text>
            <Text variant="text" color="black" fontSize={12} fontWeight="300" numberOfLines={2}
                  ellipsizeMode="tail">
              Our signature Double Cheeseburger comes with two 3oz patties, american cheese.
            </Text>
          </View>
        </View>
        <View style={{ width: "20%", alignItems: "center" }}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">
            $9.99
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = (section) => {
    return (
      <View style={styles.itemContain}>
        <View style={styles.flexRow}>
          <Image source={Images.item} style={styles.downIcon} />
          <View style={{ width: "72%" }}>
            <Text variant="text" color="black" fontSize={12} fontWeight="500">
              2x Double Cheeseburger
            </Text>
            <Text variant="text" color="black" fontSize={12} fontWeight="300" numberOfLines={2}
                  ellipsizeMode="tail">
              Our signature Double Cheeseburger comes with two 3oz patties, american cheese.
            </Text>
          </View>
        </View>
        <View style={{ width: "20%", alignItems: "center" }}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">
            $9.99
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = (section) => {
    return (
      <View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Price</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">$41.87</Text>
        </View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Fee</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">$6.87</Text>
        </View>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">Total</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">48.87</Text>
        </View>
        <View style={styles.items}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Address
          </Text>
        </View>

        <View style={[styles.instructionView, { flexDirection: "row", justifyContent: "space-between" }]}>
          <View style={{ width: "60%" }}>
            <Text variant="text" color="black" fontSize={12} fontWeight="400" numberOfLines={2} ellipsizeMode="tail">
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </Text>
          </View>
          <Button loading={false} text="Other"
                  style={styles.btnOther} fontSize={16}
                  onPress={() => {
                  }} />
        </View>

        <View style={styles.instructionView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">
            Special insructions
          </Text>

          <CustomTextInput
            value={searchtext}
            onChangeText={(text) => setSearchText(text)}
            onBlurText={onBlurSearch}
            multiline={true}
          />

          <Button loading={false} text="Confirm"
                  onPress={() => {
                  }} />
        </View>
      </View>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="My Basket"
        showBackIcon={true}
      />
      <View style={styles.container}>
        {loading && <ActivityIndicators />}

        <View style={styles.items}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Items
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Accordion
            sections={restaurants ?? [
              {
                title: "First",
                content: "Lorem ipsum...",
              },
              {
                title: "Second",
                content: "Lorem ipsum...",
              },
            ]}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
          />
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
