import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, CustomTextInput, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsData } from "../../../screenRedux/customerRedux";
import { navigate } from "navigation/NavigationService";

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const user = useSelector(state => state.loginReducer.user);
  const restaurants = useSelector(state => state.customerReducer.restaurants);
  const [searchtext, setSearchText] = useState(null);

  useEffect(() => {
    dispatch(getRestaurantsData());
  }, []);

  const onBlurSearch = () => {

  };

  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.headerView}>
        <View style={styles.profileView}>
          <Image source={Images.dummyProfile} defaultSource={Images.dummyProfile} style={styles.profilePic} />
          <Text variant="text" color="gray" fontSize={12} fontWeight="500" style={{ marginLeft: scaleVertical(5) }}>
            {user.name}
          </Text>
        </View>
        <Pressable onPress={() => alert("ss")} style={{ alignItems: "flex-start" }}>
          <Text variant="text" color="primary" fontSize={12} fontWeight="700">
            DELIVER TO
          </Text>
          <View style={styles.locationView}>
            <Text variant="text" color="gray" fontSize={14} fontWeight="400" style={{ marginRight: scaleVertical(5) }}>
              Chosen Address
            </Text>
            <Image source={Images.downArrow} style={styles.downIcon} />
          </View>
        </Pressable>
      </View>
      <View style={styles.container}>
        {loading && <ActivityIndicators />}

        <CustomTextInput
          title="EMAIL"
          value={searchtext}
          placeholder="Search restaurants"
          onChangeText={(text) => setSearchText(text)}
          onBlurText={onBlurSearch}
        />
        <Pressable onPress={() => navigate("RestaurantDetails")}>
          {restaurants?.map((rest, index) => {
            console.log(rest.id);
            return (<View key={index.toString()}>
              <Text variant="text" color="black">
                Rest
              </Text>
            </View>);
          })}
        </Pressable>
      </View>
    </BaseScreen>);
};
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1, backgroundColor: color.white,
  },
  headerView: {
    width: "100%", padding: scaleVertical(25), justifyContent: "space-between", flexDirection: "row",
  },
  profileView: { flexDirection: "row", alignItems: "center", width: "50%" },
  locationView: { flexDirection: "row", alignItems: "center" },
  profilePic: { width: scaleVertical(34), height: scaleVertical(34), borderRadius: scaleVertical(17) },
  downIcon: { width: scaleVertical(11), height: scaleVertical(8) },
  container: { flex: 1, backgroundColor: color.white, padding: scaleVertical(25), paddingTop: scaleVertical(0) },
});

export default Home;
