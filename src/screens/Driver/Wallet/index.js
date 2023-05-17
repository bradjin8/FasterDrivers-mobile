import DriverHeader from "components/DriverHeader";
import PaymentCard from "components/PaymentCard";
import {navigate} from "navigation/NavigationService";
import React from "react";
import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";
import {color, scale, scaleVertical} from "utils";
import BaseScreen from "../../../components/BaseScreen";
import {Flex, Margin, Border} from "../../../theme/Styles";
import {Text} from "../../../components/text";
import {Button} from "../../../components/button";

const Wallet = () => {
  const {user: {name, driver: driver}} = useSelector((state) => state.loginReducer)
  const {isWithdrawing} = useSelector(state => state.driverReducer)
  // console.log('driver', driver)

  const onWithdraw = () => {

  }

  return (
    <View style={styles.mainWrapper}>
      <DriverHeader photo={driver?.photo} name={name}/>
      <View style={styles.container}>
        <View style={[Flex.itemsCenter]}>
          <Text variant={'h5'} color={'primary'} fontSize={16}>Total Earnings</Text>
          <Text variant={'h5'} color={'primary'} fontWeight={'700'}>$47.65</Text>
        </View>
        <View style={[Margin.v10]}>
          <PaymentCard payment={mockPayment} active={true}/>
          <Button
            style={[Border.black]}
            variant="outline"
            text="Add New"
            textColor="black"
            onPress={() => navigate("AddCard")}
            fontSize={16}
            fontWeight="600"
            icon="add"
          />
        </View>
      </View>
      <View style={styles.withdrawContainer}>
        <Button loading={isWithdrawing} text="Withdraw Money" fontSize={18} fontWeight={'600'} mt={20} onPress={onWithdraw}/>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  withdrawContainer: {
    position: 'absolute',
    bottom: scaleVertical(10),
    left: scale(20),
    right: scale(20)
  }
})

export default Wallet;

const mockPayment = {
  card: {
    last4: '7436'
  },
  id: ''
}
