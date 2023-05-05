import StatusFilter from "components/StatusFilter";
import {navigate} from "navigation/NavigationService";
import React, {useEffect} from "react";
import {ActivityIndicator, Pressable, StyleSheet, View, Image, FlatList} from "react-native";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useDispatch, useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import {Text} from "../../../components/index";
import BaseScreen from "../../../components/BaseScreen";
import {Images} from "../../../theme";
import OrderByCustomer from "../../../components/OrderByCustomer";

const Home = () => {
  const dispatch = useDispatch()
  const {user, accessToken} = useSelector((state) => state.loginReducer)
  const [tab, setTab] = React.useState(0)

  console.log('accessToken', accessToken)

  const {name, restaurant} = user

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
          data={mockData}
          renderItem={({item, index, separators}) => {
            return <OrderByCustomer data={item} key={index} status={tab}/>
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
    paddingVertical: scaleVertical(5)
  }
})

export default Home;

const mockData = [{
  id: 1,
  dishes: [
    {
      name: 'Double Cheeseburger',
      price: 9.99,
      quantity: 2,
      image: 'https://fastfood-recipes.com/wp-content/uploads/2017/04/Mcdonalds-Double-Cheeseburger-Copycat-Recipe-e1510226436965.jpg',
      description: 'Our Signature Double Cheeseburger Comes With Two 3oz Patties, American Cheese, Pickles, Onions, Ketchup, Mustard, And Mayo On A Toasted Brioche Bun.',
    }
  ],
  user: {
    name: 'Cody Fisher',
    avatar: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/E5CA/production/_128162885_codystratford.jpg',
  },
  fee: 5.88
}, {
  id: 2,
  dishes: [
    {
      name: 'Buffalo Wings',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget aliquam quam.',
      price: 10.99,
      quantity: 1,
      image: 'https://fastfood-recipes.com/wp-content/uploads/2017/04/Mcdonalds-Double-Cheeseburger-Copycat-Recipe-e1510226436965.jpg',
    },
    {
      name: 'Double Cheeseburger',
      description: 'Our Signature Double Cheeseburger Comes With Two 3oz Patties, American Cheese, Pickles, Onions, Ketchup, Mustard, And Mayo On A Toasted Brioche Bun.',
      price: 9.99,
      quantity: 2,
      image: 'https://fastfood-recipes.com/wp-content/uploads/2017/04/Mcdonalds-Double-Cheeseburger-Copycat-Recipe-e1510226436965.jpg',
    }
  ],
  user: {
    name: 'Eleanor Pena ',
    avatar: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/E5CA/production/_128162885_codystratford.jpg',
  },
  fee: 5.88
}]
