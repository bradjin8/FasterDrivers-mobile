import StatusFilter from "components/StatusFilter";
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {ActivityIndicator, Pressable, StyleSheet, View, Image, FlatList} from "react-native";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Text} from "../../../components/index";
import BaseScreen from "../../../components/BaseScreen";
import {ORDER_STATUS} from "../../../consts/orders";
import {viewMyOrdersRequest} from "../../../screenRedux/restaurantRedux";
import {Images} from "../../../theme";
import OrderByCustomer from "../../../components/OrderByCustomer";

const Home = ({route}) => {
  const dispatch = useDispatch()
  const {user, accessToken} = useSelector((state) => state.loginReducer)
  const {myOrders, loading, needToRefreshOrders} = useSelector((state) => state.restaurantReducer)
  const [tab, setTab] = React.useState(route.params?.tab || 0)

  // console.log('myOrders', myOrders)

  const {name, restaurant} = user

  const fetchMyOrders = () => {
    let status
    switch (tab) {
      case 0:
        status = [ORDER_STATUS.Unpaid, ORDER_STATUS.Pending]
        break
      case 1:
        status = [ORDER_STATUS.Accepted, ORDER_STATUS.InProgress, ORDER_STATUS.InTransit]
        break
      case 2:
        status = [ORDER_STATUS.Delivered, ORDER_STATUS.Rejected]
        break
      default:
        status = []
    }
    dispatch(viewMyOrdersRequest({
      restaurant: restaurant.id,
      status: status.join(','),
    }))
  }

  useEffect(() => {
    fetchMyOrders()
  }, [tab, needToRefreshOrders])

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <View>
          <Text color='item' variant='h5'>{name}</Text>
          <Text color='darkGray' fontSize={12}>{`${restaurant.street}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip_code}`}</Text>
        </View>
        <Pressable onPress={() => {
        }}>
          <Image source={Images.Next} style={styles.nextIcon}/>
        </Pressable>
      </View>
      <StatusFilter status={tab} changeStatus={setTab}/>
      <FlatList
        data={myOrders}
        renderItem={({item, index, separators}) => {
          return <OrderByCustomer order={item} key={index} tab={tab} setTab={setTab}/>
        }}
        ListEmptyComponent={() => {
          return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text color='darkGray' fontSize={14}>No orders</Text>
          </View>
        }}
        onRefresh={fetchMyOrders}
        refreshing={loading}
        style={{
          backgroundColor: color.lightGray,
          flex: 1,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  header: {
    paddingHorizontal: widthPercentageToDP(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleVertical(5)
  },
  nextIcon: {
    marginLeft: widthPercentageToDP(5),
    width: scale(10),
    height: scale(10),
    resizeMode: 'contain'
  },
  container: {
    backgroundColor: color.lightGray,
    paddingVertical: scaleVertical(5),
  }
})

export default Home;
