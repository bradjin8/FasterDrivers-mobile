import React, {useState} from 'react';
import {View, StyleSheet, Image, Pressable} from 'react-native';
import {widthPercentageToDP} from "react-native-responsive-screen";
import {color, scale, scaleVertical} from "utils";
import {truncateString} from "utils/utils";
import {Text} from "../components/index";
import {Images} from "../theme";


const OrderByCustomer = ({data, status}) => {
  const [expanded, setExpanded] = useState(false)

  const renderOrderStatus = () => {
    switch (status) {
      case 0:
        return <Text color='primary'>New</Text>
      case 1:
        return <Text color='warn'>In Progress</Text>
      case 2:
        return <Text color='info'>Completed</Text>
      default:
        return <Text color='primary'>New</Text>
    }
  }

  const getPrice = () => {
    const price = data.dishes.reduce((acc, item) => {
      acc += item.price * item.quantity
      return acc
    }, 0)
    return price
  }

  const renderAction = () => {
    if (status === 0) {
      return (
        <View style={styles.rowEvenly}>
          <Pressable style={styles.decline}>
            <Text color='white' variant='strong'>Decline</Text>
          </Pressable>
          <Pressable style={styles.accept}>
            <Text color='white' variant='strong'>Accept</Text>
          </Pressable>
        </View>
      )
    } else if (status === 1) {
      return (
        <View style={styles.rowCenter}>
          <Pressable style={styles.assign}>
            <Text color='white' variant='strong'>Assign to Driver</Text>
          </Pressable>
        </View>
      )
    }

    return <View></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View>
          <Image source={{uri: data.user.avatar}} style={styles.avatar}/>
        </View>
        <View style={styles.itemBody}>
          <View style={styles.row}>
            <Text color='item' variant='h5' fontSize={14}>{data.user.name}</Text>
            {renderOrderStatus()}
          </View>
          <View style={styles.row}>
            <Text color={'item'}>{data.dishes.length} Order</Text>
            <Text color='darkGray' fontSize={12}>10 Minues Ago</Text>
          </View>
        </View>
        <Pressable style={styles.itemNext} onPress={() => setExpanded(!expanded)}>
          <Image source={expanded ? Images.Down : Images.Next} style={styles.expandIcon} resizeMode='contain'/>
        </Pressable>
      </View>
      {expanded === true && <View style={styles.detailContainer}>
        {data.dishes.map((item, index) => {
          return (
            <View style={styles.dishContainer} key={index}>
              <View style={styles.dishBody}>
                <Image source={{uri: item.image}} style={styles.photo}/>
                <View>
                  <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>{item.name}</Text>
                  <Text color={'darkGray'} variant={'hint'}>{truncateString(item.description, 50)}</Text>
                </View>
              </View>
              <View>
                <Text color='item' variant='h5' fontSize={14}>${item.price}</Text>
              </View>
            </View>
          )
        })}
        <View style={styles.priceContainer}>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Price</Text>
            <Text color='item' variant='h5' fontSize={14}>${getPrice()}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Fee</Text>
            <Text color='item' variant='h5' fontSize={14}>${data.fee}</Text>
          </View>
          <View style={styles.row}>
            <Text color={'item'} fontWeight={'400'} variant={'h5'} fontSize={12}>Fee</Text>
            <Text color='item' variant='h5' fontSize={14}>${data.fee + getPrice()}</Text>
          </View>
        </View>
        {renderAction()}
      </View>}
    </View>
  )
}

export default OrderByCustomer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    marginVertical: scaleVertical(5),
  },
  item: {
    marginVertical: scale(10),
    width: widthPercentageToDP(100),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    resizeMode: 'cover'
  },
  itemBody: {
    width: widthPercentageToDP(65),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemNext: {
    width: widthPercentageToDP(6),
  },
  expandIcon: {
    width: scale(12),
    height: scale(12),
    tintColor: color.black,
  },
  detailContainer: {
    width: widthPercentageToDP(100),
    paddingVertical: 10,
  },
  dishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingRight: widthPercentageToDP(4),
    alignItems: 'center'
  },
  dishBody: {
    flexDirection: 'row',
    width: widthPercentageToDP(70),
    alignItems: 'center',
  },
  photo: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'cover',
    marginRight: widthPercentageToDP(2)
  },
  priceContainer: {
    padding: 10,
  },
  rowEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  decline: {
    backgroundColor: color.error,
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(80),
    borderRadius: scale(15)
  },
  accept: {
    backgroundColor: color.info,
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(80),
    borderRadius: scale(15)
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assign: {
    backgroundColor: color.primary,
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(80),
    borderRadius: scale(15)
  }
})
