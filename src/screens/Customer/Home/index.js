import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, screenWidth } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, CustomTextInput, Text } from "../../../components/index";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsData } from "../../../screenRedux/customerRedux";
import StarRating from 'react-native-star-rating-new';
import Icon from 'react-native-vector-icons/dist/Feather';
import { navigate } from "navigation/NavigationService";

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const user = useSelector(state => state.loginReducer.user);
  const restaurants = useSelector(state => state.customerReducer.restaurants);
  const [searchText, setSearchText] = useState(null);
  
  useEffect(() => {
    dispatch(getRestaurantsData(searchText ? searchText  : null));
  }, [searchText]);
  
  const onBlurSearch = () => {
  
  };
  
  const renderItems = (rest, i) => {
    return(
      <Pressable key={i.toString()} style={styles.itemContain} onPress={() => navigate("RestaurantDetails", { restaurant: rest.id })}>
        <Image source={rest.photo ? {uri: rest.photo} : Images.item} style={styles.itemImage} />
        <View style={styles.textContain}>
          <Text variant="text" color="item" fontSize={14} fontWeight="400">
            {rest.name}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {rest.description}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <StarRating
              disabled={true}
              maxStars={1}
              rating={rest.rating_count/5}
              starSize={20}
              starStyle={{color: color.primary, fontWeight: 'bold'}}
            />
            <Text variant="text" color="item" fontSize={16} fontWeight="700" style={{marginLeft: scaleVertical(5)}}>
              {rest.rating_count}
            </Text>
          </View>
        </View>
      </Pressable>
    )
  }
  const renderRestaurants = () => {
    const keys = Object.keys(restaurants || {});
    if(keys.length === 0) {
      return <View>
        <Text variant="text" color="black" style={styles.noData}>
          No data found
        </Text>
      </View>
    }
    return (
      keys.map((type, index) => {
        return(
          <View>
            <View style={styles.itemTitle}>
              <Text variant="text" color="secondaryBtn" fontSize={14} fontWeight="600">
                {type}
              </Text>
              <View style={styles.flex}>
                <Text variant="text" color="secondaryBtn" fontSize={14} fontWeight="400">
                  See All
                </Text>
                <Icon name="chevron-right" style={{marginLeft: scaleVertical(7.5)}} size={20} color={color.itemPrimary} />
              </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop: scaleVertical(15), paddingBottom: 20}}>
              {restaurants[type].map((rest, i) => renderItems(rest, i))}
            </ScrollView>
          </View>
        )
      })
    )
  }
  
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
        <CustomTextInput
          isImages={true}
          value={searchText}
          placeholder="Search restaurants"
          onChangeText={(text) => setSearchText(text)}
          onBlurText={onBlurSearch}
        />
        
        {loading && <ActivityIndicators />}
        {renderRestaurants()}
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
  flex: {flexDirection: 'row', alignItems: 'center'},
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: scaleVertical(25),
    paddingTop: scaleVertical(0),
  },
  itemImage: {
    width: '100%',
    height: screenWidth/3,
    borderRadius: scaleVertical(15),
  },
  textContain: {
    padding: scaleVertical(7.5),
    paddingHorizontal: scaleVertical(10)
  },
  itemContain: {
    width: screenWidth/1.8,
    backgroundColor: color.secondary,
    shadowColor: color.secondary,
    marginHorizontal: scaleVertical(5),
    borderRadius: scaleVertical(15),
    overflow: 'hidden',
  },
  itemTitle: { flexDirection: 'row', justifyContent: 'space-between'},
  noData: {textAlign: 'center', marginTop: scaleVertical(20)},
});

export default Home;
