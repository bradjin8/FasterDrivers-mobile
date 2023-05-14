import SimpleHeader from "components/SimpleHeader";
import React, {useRef, useState} from "react";
import {Image, Platform, Pressable, StyleSheet, View} from "react-native";
import ActionSheet from "react-native-actionsheet";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {pickFromCamera, pickFromGallery} from "utils/Camera";
import {Button, CustomTextInput, Text} from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import {updateAccount} from "../../../screenRedux/loginRedux";

const CarDetails = () => {
  const actionSheet = useRef(null);
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const dispatch = useDispatch();
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const {driver: {car_image, car_make, car_model, car_vin, car_license_number}} = user

  const [pickImage, setPickImage] = useState(car_image)
  const [changeImage, setChangeImage] = useState(null)

  const [customerDetails, setCustomerDetails] = useState({
    "driver.car_make": car_make,
    "driver.car_model": car_model,
    "driver.car_vin": car_vin,
    "driver.car_license_number": car_license_number,
  })

  const onChangeText = (key, text) => {
    setCustomerDetails(prevState => ({...prevState, [key]: text}));
  }

  const onSave = () => {
    let data = new FormData();
    if (changeImage) {
      data.append('driver.car_image', {
        name: `rnd-${pickImage.path}`,
        type: pickImage.mime,
        uri: Platform.OS === 'ios' ? pickImage.sourceURL.replace('file://', '') : pickImage.path,
        data: pickImage.data
      });
    }
    data.append("driver.car_make", customerDetails["driver.car_make"]);
    data.append("driver.car_model", customerDetails["driver.car_model"]);
    data.append("driver.car_vin", customerDetails["driver.car_vin"]);
    data.append("driver.car_license_number", customerDetails["driver.car_license_number"]);

    dispatch(updateAccount(data))
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Car Details"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={styles.imageContain}>
          <Pressable style={styles.imageButton} onPress={() => actionSheet.current.show()}>
            <View style={styles.pencileView}>
              <SimpleLineIcons name={'pencil'} size={scale(12)} color={color.black}/>
            </View>
            {pickImage ?
              <Image source={{uri: changeImage ? pickImage?.path : pickImage}} style={styles.actualImage} defaultSource={Images.Capture} resizeMode={'contain'}/>
              :
              <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon}/>
            }
          </Pressable>
        </View>

        <View>
          <Text variant="text" color="black">
            Mark
          </Text>
          <CustomTextInput
            value={customerDetails["driver.car_make"]}
            onChangeText={(text) => onChangeText("driver.car_make", text)}
          />
          <Text variant="text" color="black">
            Model
          </Text>
          <CustomTextInput
            value={customerDetails["driver.car_model"]}
            onChangeText={(text) => onChangeText("driver.car_model", text)}
          />
          <Text variant="text" color="black">
            VIN Number
          </Text>
          <CustomTextInput
            value={customerDetails["driver.car_vin"]}
            onChangeText={(text) => onChangeText("driver.car_vin", text)}
          />
          <Text variant="text" color="black">
            Licence Number
          </Text>
          <CustomTextInput
            value={customerDetails["driver.car_license_number"]}
            onChangeText={(text) => onChangeText("driver.car_license_number", text)}
          />
        </View>
        <View style={{marginTop: scaleVertical(50)}}>
          <Button text='Save' loading={loading} fontSize={16} onPress={() => onSave()} mt={30} fontWeight="700"/>
        </View>
      </View>
      <ActionSheet
        ref={actionSheet}
        title={"Select Image"}
        options={ImagePickerOptions}
        cancelButtonIndex={2}
        onPress={async (index) => {
          let res;
          switch (index) {
            case 0:
              res = await pickFromCamera();
              break;
            case 1:
              res = await pickFromGallery();
              break;
          }
          if (res) {
            setChangeImage(true)
            setPickImage(res)
          }
        }}
      />
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  imageContain: {width: '100%', justifyContent: 'center', alignItems: 'center'},
  imageButton: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginVertical: scaleVertical(25),
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pencileView: {
    width: scaleVertical(25), height: scaleVertical(25), borderRadius: scaleVertical(12.5),
    backgroundColor: color.white, position: 'absolute', top: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 100
  },
  actualImage: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40)
  },
  icon: {
    width: scale(36),
    height: scaleVertical(30),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  stateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default CarDetails;
