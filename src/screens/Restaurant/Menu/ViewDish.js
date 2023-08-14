import ConfirmModal from "components/ConfirmModal";
import SimpleHeader from "components/SimpleHeader";
import {navigate} from "navigation/NavigationService";
import React from "react";
import {Alert, Image, Pressable, StyleSheet, View} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch} from "react-redux";
import {color, scale} from "utils";
import BaseScreen from "../../../components/BaseScreen";
import {Text} from "../../../components/index";
import {logoutRequest} from "../../../screenRedux/loginRedux";
import {deleteDish} from "../../../screenRedux/restaurantRedux";

const ViewDish = ({route, navigation}) => {
  const dish = route.params?.dish || {}
  const [showModal, setShowModal] = React.useState(false)
  const dispatch = useDispatch()
  const tryDeleteDish = () => {
    if (dish.id) {
      dispatch(deleteDish(dish.id))
    }
    setShowModal(false)
  }

  const onDelete = () => {
    Alert.alert(`Are you sure you want to delete this dish?`, '', [
      {
        text: 'Cancel', onPress: () => {

        }
      },
      {
        text: "Yes", onPress: () => {
          tryDeleteDish()
        }
      },
    ]);
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title={dish?.name}
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.image}>
          <Image source={{uri: dish?.image_1}} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
          <View style={styles.controls}>
            <Pressable style={styles.edit} onPress={() => navigate("AddNewDish", {dish})}>
              <SimpleLineIcons name={'pencil'} size={scale(14)} color={color.black}/>
            </Pressable>
            <Pressable style={[styles.edit, {backgroundColor: 'red', marginLeft: 10}]} onPress={onDelete}>
              <SimpleLineIcons name={'trash'} size={scale(14)} color={color.white}/>
            </Pressable>
          </View>
        </View>
        <View style={styles.body}>
          <Text variant='strong' fontSize={14} color='black'>{dish?.name}</Text>
          <Text variant='h5' fontSize={14} color='black'>${dish?.price}</Text>
          <Text variant='text' fontSize={12} color='black'>{dish?.description}</Text>
        </View>
      </View>
      <ConfirmModal
        title={'Please confirm'}
        message={'Are you sure to delete this dish?'}
        visible={showModal}
        onOk={tryDeleteDish}
        onCancel={() => setShowModal(false)}
        okCaption={'Yes'}
        cancelCaption={'Cancel'}
      />
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white},
  image: {
    width: widthPercentageToDP(100),
    height: widthPercentageToDP(75),
    backgroundColor: color.lightGray,
  },
  controls: {
    position: 'absolute',
    top: widthPercentageToDP(2),
    right: widthPercentageToDP(2),
    flexDirection: 'row',
  },
  edit: {
    width: widthPercentageToDP(8),
    height: widthPercentageToDP(8),
    borderRadius: widthPercentageToDP(4),
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: color.white,
  },
  body: {
    padding: widthPercentageToDP(4)
  }
})

export default ViewDish;
