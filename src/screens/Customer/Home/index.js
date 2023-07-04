import CustomMessageModal from "components/CustomMessageModal";
import {navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {Menu, MenuItem} from 'react-native-material-menu';
import StarRating from 'react-native-star-rating-new';
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from 'react-native-vector-icons/dist/Feather';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme";
import {color, scale, scaleVertical, screenWidth} from "utils";
import {getCurrentLocation} from "utils/Location";
import {truncateString} from "utils/utils";
import {ActivityIndicators, CustomTextInput, Text} from "../../../components/index";
import {getAddressesData, getRestaurantsData} from "../../../screenRedux/customerRedux";
import {Flex} from "../../../theme/Styles";
import {getAddressFromLocation} from "../../../third-party/google";

const Home = ({navigation}) => {
  const dispatch = useDispatch()
  const {loading, locationLoading, addresses, restaurants} = useSelector(state => state.customerReducer)
  const {user} = useSelector(state => state.loginReducer)
  const [searchText, setSearchText] = useState(null)
  const [visible, setVisible] = useState(false)
  const {customer: {photo}, name} = user
  const [currentAddress, setCurrentAddress] = useState(null)
  const [address, setAddress] = useState({})
  const [visibleCustomModal, setVisibleCustomModal] = useState(false)

  const fetchData = () => {
    dispatch(getAddressesData())
    dispatch(getRestaurantsData(searchText ? searchText : null));
  }
  // console.log('addresses', addresses, position)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData()
    });
    return unsubscribe;
  }, [])

  useEffect(() => {
    dispatch(getRestaurantsData(searchText ? searchText : null));
  }, [searchText]);

  const onBlurSearch = () => {

  };


  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const setDefaultAddress = (item) => {
    hideMenu();
    setAddress(item)
  }

  const pickCurrentLocation = () => {
    getCurrentLocation()
      .then(async (loc) => {
        const address = await getAddressFromLocation(loc)
        console.log('address', address)
        if (address) {
          setCurrentAddress(address)
          setAddress(address)
        } else {
          showMessage({
            message: 'Unable to get address',
            type: "danger",
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
        showMessage({
          message: err.message,
          type: "danger",
        })
      })
      .finally(() => {
        hideMenu()
      })
  }

  useEffect(() => {
    if (addresses?.length > 0) {
      setAddress(addresses[0])
    }
  }, [addresses])


  const renderRestaurant = (rest, i) => {
    const {photo, name, description, rating, rating_count,} = rest || {}
    return (
      <Pressable key={"item-" + i.toString()} style={styles.itemContain} onPress={() => {
        if (address.id)
          navigate("RestaurantDetails", {restaurant: rest, address: address})
        else
          showMessage({
            message: 'Please select an address',
            type: "danger",
          })
      }}>
        <Image source={photo ? {uri: photo} : Images.item} style={styles.itemImage}/>
        <View style={styles.textContain}>
          <Text variant="text" color="item" fontSize={14} fontWeight="400">
            {name}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {truncateString(description, 50)}
          </Text>
          <View style={[Flex.row, Flex.itemsCenter]}>
            <StarRating
              disabled={true}
              maxStars={1}
              rating={0}
              starSize={20}
              fullStarColor={color.primary}
              emptyStarColor={color.primary}
              halfStarColor={color.primary}
            />
            <Text variant="strong" color="item" fontSize={16} fontWeight="700" style={{marginLeft: scaleVertical(5)}}>
              {Number(rating).toFixed(1)}
            </Text>
          </View>
        </View>
      </Pressable>
    )
  }
  const renderRestaurants = () => {
    const keys = Object.keys(restaurants || {});
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
          <View key={"rest-" + index}>
            <View style={styles.itemTitle}>
              <Text variant="strong" color="item" fontSize={14} fontWeight="500">
                {type}
              </Text>
              <View style={styles.flex}>
                <Text variant="text" color="secondaryBtn" fontSize={14} fontWeight="400">
                  See All
                </Text>
                <Icon name="chevron-right" style={{marginLeft: scaleVertical(7.5)}} size={20} color={color.itemPrimary}/>
              </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop: scaleVertical(15), paddingBottom: 20}}>
              {restaurants[type].map((rest, i) => renderRestaurant(rest, i))}
            </ScrollView>
          </View>
        )
      })
    )
  }
  const renderLocation = (_address) => {
    if (_address.zip_code) {
      const {street, city, state, zip_code} = _address
      return `${street}, ${city}, ${state} ${zip_code}`
    }
    return 'Choose an Address'
  }

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.headerView}>
        <View style={styles.profileView}>
          <Image source={{uri: photo}} defaultSource={Images.dummyProfile} style={styles.profilePic}/>
          <Text variant="strong" color="gray" fontSize={12} fontWeight="400" style={{marginLeft: scaleVertical(5)}}>
            {name}
          </Text>
        </View>
        {locationLoading ? (<ActivityIndicator color={color.primary} size='small' style={styles.activityView}/>) :
          <Pressable onPress={() => showMenu()} style={styles.locationView}>
            <Text onPress={() => showMenu()} variant="text" color="primary" fontSize={12} fontWeight="700" style={{textAlign: 'left'}}>
              DELIVER TO
            </Text>
            <Menu
              visible={visible}
              anchor={
                <View style={styles.locationContain}>
                  <Text variant="text" color="item" fontSize={10} fontWeight="400">
                    {renderLocation(address)}
                  </Text>
                  <AntDesign name={'caretdown'} size={10} color={color.black} style={{marginLeft: scaleVertical(5)}}/>
                </View>
              }
              onRequestClose={() => hideMenu()}
            >
              <MenuItem style={styles.locationPopup}>
                <View style={styles.locationMenuItem}>
                  <Text variant="text" color="black" fontSize={14} fontWeight="600" style={{marginLeft: Platform.OS === 'ios' ? scale(15) : 0}}>
                    Choose Location
                  </Text>
                  <Icon onPress={() => hideMenu()} name="x" size={16} color={color.black}/>
                </View>
              </MenuItem>
              {addresses?.map((_address, index) => {
                return (
                  <MenuItem
                    style={{justifyContent: 'center', height: 35}}
                    key={"menu-" + index.toString()}
                    onPress={() => setDefaultAddress(_address)}>
                    <Text variant="text" color="item" fontSize={12} fontWeight="400">
                      {renderLocation(_address)}
                    </Text>
                  </MenuItem>
                )
              })}
              {currentAddress ?
                <MenuItem onPress={() => setDefaultAddress(currentAddress)} style={{justifyContent: 'center'}}>
                  <Text variant="item" color="gray" fontSize={12} fontWeight="400">
                    {renderLocation(currentAddress)}
                  </Text>
                </MenuItem>
                :
                <MenuItem onPress={pickCurrentLocation} style={{justifyContent: 'center'}}>
                  <View style={[styles.locationPopup, styles.flex]}>
                    <MaterialIcons name="location-pin" size={16} color={color.black} style={{marginLeft: Platform.OS === 'ios' ? scale(12.5) : 0}}/>
                    <Text variant="text" color="gray" fontSize={12} fontWeight="400" style={{marginLeft: scale(5)}}>
                      Use Current Location
                    </Text>
                  </View>
                </MenuItem>
              }
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
          (<ActivityIndicators/>)
          :
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderRestaurants()}
          </ScrollView>
        }
      </View>
      <CustomMessageModal data={{}} visible={visibleCustomModal} close={() => setVisibleCustomModal(false)} onOk={() => {}}/>
    </SafeAreaView>);
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
  activityView: {width: '50%', alignItems: 'center', justifyContent: 'flex-start'},
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
  locationPopup: {justifyContent: 'center', width: '100%'},
  locationMenuItem: {justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center'},
  profilePic: {width: scaleVertical(34), height: scaleVertical(34), borderRadius: scaleVertical(17)},
  flex: {flexDirection: 'row', alignItems: 'center'},
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: scaleVertical(25),
    paddingTop: scaleVertical(0),
  },
  itemImage: {
    width: '100%',
    height: screenWidth / 3,
    borderRadius: scaleVertical(15),
  },
  textContain: {
    padding: scaleVertical(7.5),
    paddingHorizontal: scaleVertical(10)
  },
  itemContain: {
    width: screenWidth / 1.8,
    backgroundColor: color.white,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: scaleVertical(5),
    borderRadius: 15,
    // overflow: 'hidden',
  },
  itemTitle: {flexDirection: 'row', justifyContent: 'space-between'},
  noData: {textAlign: 'center', marginTop: scaleVertical(20)},
});

export default Home;
