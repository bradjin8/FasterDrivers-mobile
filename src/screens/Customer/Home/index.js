import React, { useEffect, useState, useRef } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View, Platform, PermissionsAndroid, Linking, ToastAndroid, Alert, ActivityIndicator } from "react-native";
import { color, scale, scaleVertical, screenWidth } from "utils";
import { Images } from "src/theme";
import {truncateString} from "utils/utils";
import { ActivityIndicators, CustomTextInput, Text } from "../../../components/index";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getAddressesData, getRestaurantsData, updateAddresses } from "../../../screenRedux/customerRedux";
import StarRating from 'react-native-star-rating-new';
import Icon from 'react-native-vector-icons/dist/Feather';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { navigate } from "navigation/NavigationService";
import MapView from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { Menu, MenuItem } from 'react-native-material-menu';

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const locationLoadingReducer = useSelector(state => state.customerReducer.locationLoading);
  const user = useSelector(state => state.loginReducer.user);
  const restaurants = useSelector(state => state.customerReducer.restaurants);
  const addressesReducer = useSelector(state => state.customerReducer.addresses);
  const [addresses, setAddresses] = useState(addressesReducer);
  const [locationLoading, setLocationLoading] = useState(locationLoadingReducer);
  const [searchText, setSearchText] = useState(null);
  const watchId = useRef(0);
  const [visible, setVisible] = useState(false);
  const { customer: { photo }, name } = user

  useEffect(() => {
    setAddresses(addressesReducer)
    setLocationLoading(locationLoadingReducer)
  }, [addressesReducer, locationLoadingReducer]);

  useEffect(() => {
    dispatch(getAddressesData())
  }, [])

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(`Turn on Location Services to determine your location.`, '', [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ]);
    }

    return false;
  };

  const hasLocationPermission = (async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  });

  const startLocationWatch = (async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    watchId.current = Geolocation.getCurrentPosition((position) => {
        return position;
      },
      (error) => {
        // See error code charts below.
        return error;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

  useEffect(() => {
    dispatch(getRestaurantsData(searchText ? searchText  : null));
  }, [searchText]);

  const onBlurSearch = () => {

  };

  const renderItems = (rest, i) => {
    const { photo, name, description, rating_count, } = rest || {}
    return(
      <Pressable key={i.toString()} style={styles.itemContain} onPress={() => navigate("RestaurantDetails", { restaurant: rest })}>
        <Image source={photo ? {uri: photo} : Images.item} style={styles.itemImage} />
        <View style={styles.textContain}>
          <Text variant="text" color="item" fontSize={14} fontWeight="400">
            {name}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {truncateString(description, 50)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <StarRating
              disabled={true}
              maxStars={1}
              rating={rating_count/5}
              starSize={20}
              fullStarColor={color.primary}
              emptyStarColor={color.lightGray}
              halfStarColor={color.primary}
            />
            <Text variant="text" color="item" fontSize={16} fontWeight="700" style={{marginLeft: scaleVertical(5)}}>
              {rating_count}
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
  const renderLocation = () => {
    let defaultAddress = addresses?.find(o => o.default);
    if(defaultAddress) {
      const { street, zip_code } = defaultAddress || {}
      return `${street} - ${zip_code}`
    }
    return 'Chosen Address'
  }

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const setDefaultAddress = (id) => {
    hideMenu();
    let data = new FormData();
    data.append('default', true);
    dispatch(updateAddresses(id, data))
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.headerView}>
        <View style={styles.profileView}>
          <Image source={{ uri: photo }} defaultSource={Images.dummyProfile} style={styles.profilePic} />
          <Text variant="text" color="gray" fontSize={12} fontWeight="500" style={{ marginLeft: scaleVertical(5) }}>
            {name}
          </Text>
        </View>
        {locationLoading ? (<ActivityIndicator color={color.primary} size='small' style={styles.activityView} />) :
         <Pressable onPress={() => showMenu()} style={styles.locationView}>
           <Text onPress={() => showMenu()} variant="text" color="primary" fontSize={12} fontWeight="700" style={{textAlign: 'left'}}>
             DELIVER TO
           </Text>
           <Menu
             visible={visible}
             anchor={
               <View style={styles.locationContain}>
                 <Text variant="text" color="gray" fontSize={14} fontWeight="400">
                   {renderLocation()}
                 </Text>
                 <Image source={Images.downArrow} style={styles.downIcon} />
               </View>
             }
             onRequestClose={() => hideMenu()}
           >
             <MenuItem style={styles.locationPopup}>
               <View style={styles.locationMenuItem}>
                 <Text variant="text" color="black" fontSize={14} fontWeight="600" style={{marginLeft: Platform.OS === 'ios' ? scale(15) : 0}}>
                   Choose Location
                 </Text>
                 <Icon onPress={() => hideMenu()} name="x" size={16} color={color.black} />
               </View>
             </MenuItem>
             {addresses?.map((address, index) => {
               return(
                 <MenuItem
                   style={{justifyContent: 'center',height: 35}}
                   key={index.toString()}
                   onPress={() => setDefaultAddress(address.id)}>
                   <Text variant="text" color="gray" fontSize={12} fontWeight="400">
                     {address.street}, {address.state} - {address.zip_code}
                   </Text>
                 </MenuItem>
               )
             })}
             <MenuItem onPress={() => hideMenu()} style={{justifyContent: 'center'}}>
               <View style={[styles.locationPopup, styles.flex]}>
                 <MaterialIcons name="location-pin" size={16} color={color.black} style={{marginLeft: Platform.OS === 'ios' ? scale(12.5) : 0}} />
                 <Text variant="text" color="gray" fontSize={12} fontWeight="400" style={{marginLeft: scale(5)}}>
                   Use Current Location
                 </Text>
               </View>
             </MenuItem>
           </Menu>
         </Pressable>}
      </View>
      <View style={styles.container}>
        <CustomTextInput
          isImages={true}
          value={searchText}
          placeholder="Search restaurants"
          onChangeText={(text) => setSearchText(text)}
          onBlurText={onBlurSearch}
        />
        {loading ?
           (<ActivityIndicators />)
          :
        renderRestaurants()}
      </View>
    </BaseScreen>);
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1, backgroundColor: color.white,
  },
  headerView: {
    width: "100%",
    padding: scaleVertical(25),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%"
  },
  activityView: {width: '50%',  alignItems: 'center', justifyContent: 'flex-start'},
  locationView: {
    flex: 1,
    width: "100%",
    justifyContent: 'center'
  },
  locationContain: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationPopup: {justifyContent: 'center',width: '100%' },
  locationMenuItem: {justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center' },
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
