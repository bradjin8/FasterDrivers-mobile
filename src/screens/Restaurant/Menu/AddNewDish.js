import SimpleHeader from "components/SimpleHeader";
import {goBack} from "navigation/NavigationService";
import React, {useRef, useState} from "react";
import {Image, Platform, Pressable, ScrollView, StyleSheet, View} from "react-native";
import ActionSheet from "react-native-actionsheet";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme"
import {color, scale, scaleVertical} from "utils";
import {pickFromCamera, pickFromGallery} from "utils/Camera";
import BaseScreen from "../../../components/BaseScreen";
import {Button, CustomDropDown, CustomTextInput, Text} from "../../../components/index";
import {addNewDishRequest, updateDish} from "../../../screenRedux/restaurantRedux";

const AddNewDish = ({route}) => {
  const dish = route.params?.dish

  console.log('dish', dish)
  let images = []
  if (dish?.image_1) {
    images.push({path: dish.image_1, type: 'url'})
  }
  if (dish?.image_2) {
    images.push({path: dish.image_2, type: 'url'})
  }
  if (dish?.image_3) {
    images.push({path: dish.image_3, type: 'url'})
  }

  const actionSheet = useRef(null);
  const dispatch = useDispatch()
  const loading = useSelector(state => state.restaurantReducer.loading)
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const [uploadImage, setUploadImage] = useState(images);
  const [newDish, setNewDish] = useState(dish || {});
  const [changeImage, setChangeImage] = useState(null)
  const [category, setCategory] = useState(dish?.category);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([
    {label: 'Burger', value: 'Burgers'},
    {label: 'Wings', value: 'Wings'},
    {label: 'Salads', value: 'Salads'},
    {label: 'Soups', value: 'Soups'},
  ])
  const [addons, setAddons] = useState(dish?.addons || [])

  const {name, description, price, sku_number} = newDish

  const onChangeText = (key, text) => {
    setNewDish(prevState => ({...prevState, [key]: text}));
  }

  const onAddNewAddon = () => {
    const newAddon = {
      title: '',
      number_of_items: 1,
      required: true,
      items: [],
    }
    setAddons(prevState => [...prevState, newAddon])
  }

  const onChangeAddon = (id, data) => {
    if (data !== null) {
      setAddons(prevState => {
        const newState = [...prevState]
        newState[id] = data
        return newState
      })
    } else {
      setAddons(prevState => {
        const newState = [...prevState]
        newState.splice(id, 1)
        return newState
      })
    }
  }

  const onSave = () => {
    let data = new FormData();
    if (changeImage) {
      uploadImage.map((image, index) => {
        if (image.type !== 'url') {
          data.append(`image_${index + 1}`, {
            name: `rnd-${image.path}`,
            type: image.mime,
            uri: Platform.OS === 'ios' ? image.sourceURL.replace('file://', '') : image.path,
            data: image.data
          });
        }
      });
    }
    data.append("name", name);
    data.append("category", category);
    data.append("description", description);
    data.append("price", price);
    data.append("sku_number", sku_number);
    let addonCount = 0
    for (let i = 0; i < addons.length; i++) {
      const addon = addons[i]
      if (addon.title) {
        data.append(`addons[${addonCount}]title`, addon.title)
        data.append(`addons[${addonCount}]number_of_items`, addon.number_of_items)
        data.append(`addons[${addonCount}]required`, addon.required)
        let itemCount = 0
        for (let j = 0; j < addon.items.length; j++) {
          const item = addon.items[j]
          if (item.name && item.price) {
            data.append(`addons[${addonCount}]items[${itemCount}]name`, item.title)
            data.append(`addons[${addonCount}]items[${itemCount}]fee`, item.price)
            itemCount++
          }
        }
        addonCount++
      }
    }
    if (dish) {
      dispatch(updateDish({id: dish.id, data}))
    } else {
      dispatch(addNewDishRequest(data))
    }
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title={dish ? 'Edit Dish' : 'Add New Dish'}
        showBackIcon={true}
      />
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.scrollContain}>
          {uploadImage.map((image, index) => {
            return (
              <View style={styles.imageContain} key={index.toString()}>
                <Image source={{uri: image.path}} style={styles.actualImage} defaultSource={Images.Capture}/>
              </View>
            )
          })}
          <Pressable style={styles.imageButton} onPress={() => actionSheet.current.show()}>
            <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon}/>
          </Pressable>
        </ScrollView>

        <View style={{flexDirection: 'column-reverse'}}>
          <CustomTextInput
            value={sku_number}
            onChangeText={(text) => onChangeText("sku_number", text)}
            keyboardType={'numeric'}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            SKU NUMBER
          </Text>

          <CustomTextInput
            value={price}
            onChangeText={(text) => onChangeText("price", text)}
            keyboardType={'numeric'}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            PRICE
          </Text>

          <CustomTextInput
            value={description}
            onChangeText={(text) => onChangeText("description", text)}
            multiline={true}
            style={{textAlignVertical: 'top'}}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            DESCRIPTION
          </Text>

          <CustomTextInput
            value={name}
            onChangeText={(text) => onChangeText("name", text)}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            NAME OF DISH
          </Text>

          <CustomDropDown
            openCategory={openCategory}
            category={category}
            categoryOptions={categoryOptions}
            setOpenCategory={setOpenCategory}
            setCategory={setCategory}
            setCategoryOptions={setCategoryOptions}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            CATEGORY
          </Text>
        </View>

        <View>
          {addons.map((it, id) => <Addon key={'addon-' + id} addon={it} onChange={(val) => onChangeAddon(id, val)}/>)}

          <Pressable onPress={onAddNewAddon} style={{width: '40%', marginVertical: scale(10)}}>
            <Text variant={'strong'} color={'primary'} fontWeight={'400'}>
              Add Ons +
            </Text>
          </Pressable>
        </View>

        <View style={styles.btnView}>
          <Button loading={loading} text='Save' fontSize={16} onPress={() => onSave()}/>
          <Button textColor={'black'} noBG text='Cancel' fontSize={16} mt={10} onPress={() => goBack()}/>
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
            setUploadImage(uploadImage => [...uploadImage, res]);
          }
        }}
      />
    </BaseScreen>
  )
}

const Addon = ({addon, onChange}) => {
  const [title, setTitle] = useState(addon.title)
  const [required, setRequired] = useState(addon.required)
  const [number_of_items, setNumberOfItems] = useState(addon.number_of_items)
  const [items, setItems] = useState(addon.items)

  const onAddNewItem = () => {
    setItems(prevState => [...prevState, {name: '', fee: ''}])
  }

  const onBlur = () => {
    onChange({title, required, number_of_items, items})
  }

  const onRemove = () => {
    onChange(null)
  }

  return (
    <View style={{justifyContent: 'space-between', marginVertical: scaleVertical(20), borderWidth: 1, borderColor: color.lightGray, padding: scale(5)}}>
      <View style={styles.addonRow}>
        <Text variant="text" color="black" style={styles.inputTitle}>
          TITLE
        </Text>
        <CustomTextInput
          value={title}
          onChangeText={(text) => setTitle(text)}
          onBlurText={onBlur}
        />
      </View>

      <View style={styles.addonRow}>
        <Text variant="text" color="black" style={styles.inputTitle}>
          NUMBER OF ITEMS
        </Text>
        <CustomTextInput
          value={number_of_items}
          onChangeText={(text) => setNumberOfItems(text)}
          keyboardType={'numeric'}
        />
      </View>

      <View style={styles.addonRow}>
        <Text variant="text" color="black" style={styles.inputTitle}>
          IS THIS REQUIRED
        </Text>
        <View style={{flexDirection: 'row', paddingHorizontal: scale(10)}}>
          <Pressable style={styles.radioContainer} onPress={() => setRequired(true)}>
            <View style={{...styles.radio, backgroundColor: required ? color.primary : color.lightGray}}/>
            <Text>Required</Text>
          </Pressable>
          <Pressable style={styles.radioContainer} onPress={() => setRequired(false)}>
            <View style={{...styles.radio, backgroundColor: !required ? color.primary : color.lightGray}}/>
            <Text>Optional</Text>
          </Pressable>
        </View>
      </View>
      {items.map((it, id) => <View key={'item-' + id} style={{...styles.addonRow, flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
        <View style={{width: '47%'}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            ITEM NAME
          </Text>
          <CustomTextInput
            value={it.name}
            onChangeText={(text) => {
              const newItems = [...items]
              newItems[id].name = text
              setItems(newItems)
            }}
            onBlurText={onBlur}
          />
        </View>
        <View style={{width: '47%'}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            FEE
          </Text>
          <CustomTextInput
            keyboardType={'numeric'}
            value={it.fee}
            onChangeText={(text) => {
              const newItems = [...items]
              newItems[id].fee = text
              setItems(newItems)
            }}
            onBlurText={onBlur}
          />
        </View>
      </View>)}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={onAddNewItem} style={styles.addonRow}>
          <Text variant={'strong'} color={'primary'} fontWeight={'400'}>
            Add {items.length > 0 ? 'Another' : ''} Item +
          </Text>
        </Pressable>
        <Pressable onPress={onRemove} style={styles.addonRow}>
          <Text variant={'strong'} color={'error'} fontWeight={'400'}>
            Remove Addon
          </Text>
        </Pressable>
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
  scrollContain: {
    paddingBottom: scaleVertical(30)
  },
  imageContain: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginRight: scale(15),
  },
  imageButton: {
    marginRight: scale(15),
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
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
  btnView: {
    paddingVertical: scaleVertical(10)
  },
  addonRow: {
    marginVertical: scaleVertical(5),
  },
  radioContainer: {
    width: '40%',
    flexDirection: 'row',
    alignItems: "center",
    paddingVertical: scaleVertical(10),
  },
  radio: {
    width: scale(12),
    height: scale(12),
    borderWidth: 2,
    borderColor: color.lightGray,
    marginRight: scale(10),
    borderRadius: 1,
  },
})

export default AddNewDish;

