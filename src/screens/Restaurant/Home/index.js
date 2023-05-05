import StatusFilter from "components/StatusFilter";
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {ActivityIndicator, Pressable, StyleSheet, View, Image, FlatList} from "react-native";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Text} from "../../../components/index";
import BaseScreen from "../../../components/BaseScreen";
import {viewMyOrdersRequest} from "../../../screenRedux/restaurantRedux";
import {Images} from "../../../theme";
import OrderByCustomer from "../../../components/OrderByCustomer";

const Home = () => {
  const dispatch = useDispatch()
  const {user, accessToken} = useSelector((state) => state.loginReducer)
  const {myOrders, loading} = useSelector((state) => state.restaurantReducer)
  const [tab, setTab] = React.useState(0)

  console.log('myOrders', myOrders)

  const {name, restaurant} = user

  const fetchMyOrders = () => {
    dispatch(viewMyOrdersRequest({
      user: user.id,
      // status: '',
    }))
  }

  useEffect(() => {
    fetchMyOrders()
  }, [])

  return (
    <BaseScreen style={styles.mainWrapper}>
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
      <View style={styles.container}>
        <FlatList
          data={myOrders}
          renderItem={({item, index, separators}) => {
            return <OrderByCustomer data={item} key={index} status={tab}/>
          }}
          ListEmptyComponent={() => {
            return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text color='darkGray' fontSize={14}>No orders</Text>
            </View>
          }}
          onRefresh={fetchMyOrders}
          refreshing={loading}
          style={{
            flex: 1,
            minHeight: heightPercentageToDP(70),
          }}
        />
      </View>
    </BaseScreen>
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

const mockData = [
  {
    "id": "9705ed3c-6b48-4a45-aa6c-3e79d50533dc",
    "user": {
      "id": "f2aab41a-f08d-4de2-ad4d-eacc74972492",
      "name": null,
      "first_name": "Cody",
      "last_name": "Fisher",
      "email": "sallar.rezaie+Customer@crowdbotics.com",
      "is_admin": false,
      "type": "Customer",
      "customer": {
        "id": "9f96aa4e-9862-471d-a2da-d1339fca78e9",
        "addresses": [
          {
            "id": "f8653af7-ac8a-4d24-8599-05857f8c47f0",
            "created_at": "2023-05-05 09:25:17",
            "updated_at": "2023-05-05 09:25:18",
            "default": false,
            "street": "51 Rodeo Dr",
            "city": "Beverly Hills",
            "state": "California",
            "zip_code": "90212",
            "location": "SRID=4326;POINT (-118.4015578 34.066932)",
            "customer": "9f96aa4e-9862-471d-a2da-d1339fca78e9"
          },
          {
            "id": "6766fa18-1aa9-4309-9e2f-70da2be99937",
            "created_at": "2023-05-05 09:25:19",
            "updated_at": "2023-05-05 09:25:19",
            "default": true,
            "street": "58 Rodeo Dr",
            "city": "Beverly Hills",
            "state": "California",
            "zip_code": "90212",
            "location": "SRID=4326;POINT (-118.4011474 34.0670655)",
            "customer": "9f96aa4e-9862-471d-a2da-d1339fca78e9"
          }
        ],
        "created_at": "2023-05-05 09:25:05",
        "updated_at": "2023-05-05 09:25:17",
        "photo": "https://ichef.bbci.co.uk/news/976/cpsprodpb/E5CA/production/_128162885_codystratford.jpg",
        "phone": "",
        "user": "f2aab41a-f08d-4de2-ad4d-eacc74972492",
        "stripe_account": null
      },
      "driver": null,
      "restaurant": null
    },
    "dishes": [
      {
        "id": "c6485dc4-cb56-4c05-8d70-b46e9cc8171d",
        "dish_addons": [
          {
            "id": "0edea53e-204c-454f-832b-00c74b608586",
            "created_at": "2023-05-05 09:26:20",
            "updated_at": "2023-05-05 09:26:20",
            "quantity": 2,
            "order": "9705ed3c-6b48-4a45-aa6c-3e79d50533dc",
            "order_dish": "c6485dc4-cb56-4c05-8d70-b46e9cc8171d",
            "item": "072873cc-04b1-4bfd-931e-8308db57aad6"
          }
        ],
        "created_at": "2023-05-05 09:26:20",
        "updated_at": "2023-05-05 09:26:20",
        "quantity": 2,
        "order": "9705ed3c-6b48-4a45-aa6c-3e79d50533dc",
        "dish": "346f10ae-2e6f-42bc-bed0-a989a0af1405"
      }
    ],
    "created_at": "2023-05-05 09:26:20",
    "updated_at": "2023-05-05 09:26:20",
    "sub_total": "55.96",
    "fees": "7.83",
    "tip": "0.00",
    "total": "63.79",
    "special_instructions": "",
    "status": "Unpaid",
    "paid_at": null,
    "accepted_at": null,
    "rejected_at": null,
    "in_progress_at": null,
    "in_transit_at": null,
    "delivered_at": null,
    "restaurant": {
      "id": "7319fa72-ce12-4b60-bb86-db53d0ad1359",
      "created_at": "2023-05-05 09:22:18",
      "updated_at": "2023-05-05 09:22:38",
      "name": "Salmon Moto",
      "photo": "/mediafiles/restaurant/images/amir_WCzYYPP.jpg",
      "phone": "4169382020",
      "street": "50 Rodeo Dr",
      "city": "Beverly Hills",
      "state": "California",
      "zip_code": "90212",
      "location": "SRID=4326;POINT (-118.4011474 34.0670655)",
      "website": "https://www.google.com",
      "ein_number": "A8D7SNM720",
      "type": "Japanese",
      "description": "Lorem Ipsum",
      "user": "10baf705-c664-4c49-a44a-67ed9fb66ba4",
      "connect_account": null,
      "rating": null,
      "rating_count": 0
    },
    "driver": null,
    "address": "f8653af7-ac8a-4d24-8599-05857f8c47f0"
  }
]
