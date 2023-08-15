import {Avatar, Box, Button, Flex, FormControl, FormLabel, Input, Switch, Text, Textarea, useToast} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {BiPencil} from "react-icons/bi";
import {IoArrowBackCircle} from "react-icons/io5";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";

export default function DishEdit({onCancel, isAdd}) {
  const {user: {restaurant}} = useSelector(state => state.auth)
  let activeDish = useSelector(state => state.ui.activeDish)
  const image1Ref = useRef(null)
  const image2Ref = useRef(null)
  const image3Ref = useRef(null)
  const api = useApi()
  const toast = useToast()

  const [data, setData] = useState({
    "name": activeDish?.name || '',
    "category": activeDish?.category || '',
    "description": activeDish?.description || '',
    "price": activeDish?.price || '',
    "sku_number": activeDish?.sku_number || '',
  })

  const [addons, setAddons] = useState(activeDish?.addons || [])

  const [images, setImages] = useState([activeDish?.image_1, activeDish?.image_2, activeDish?.image_3])
  const [photoFiles, setPhotoFiles] = useState([null, null, null])
  const imageRefs = [image1Ref, image2Ref, image3Ref]

  const [changed, setChanged] = useState(false)

  const changeData = (key, value) => {
    setData({...data, [key]: value})
    setChanged(true)
  }

  const changePhoto = (file, index) => {
    if (FileReader && file) {
      const fr = new FileReader()
      fr.onload = () => {
        let _images = [...images]
        _images[index] = fr.result
        setImages(_images)
        setChanged(true)
        let _photoFiles = [...photoFiles]
        _photoFiles[index] = file
        setPhotoFiles(_photoFiles)
      }
      fr.readAsDataURL(file)
    }
  }

  const addNewAddon = () => {
    setAddons(prev => [...prev, {title: '', number_of_items: 1, required: true, items: []}])
  }
  const changeAddon = (index, data) => {
    if (data) {
      setAddons(prev => {
        let _new = [...prev]
        _new[index] = data
        return _new
      })
    } else {
      setAddons(prev => {
        let _new = [...prev]
        _new.splice(index, 1)
        return _new
      })
    }
    setChanged(true)
  }

  const save = () => {
    if (changed) {
      setChanged(false)
      let _data = {...data}
      photoFiles.forEach((file, index) => {
        if (file) {
          _data[`image_${index + 1}`] = file
        }
      })

      addons.forEach((addon, index) => {
        _data[`addons[${index + 1}]title`] = addon.title
        _data[`addons[${index + 1}]required`] = addon.required
        _data[`addons[${index + 1}]number_of_items`] = addon.number_of_items
        addon.items.forEach((item, itemIndex) => {
          _data[`addons[${index + 1}]items[${itemIndex + 1}]name`] = item.name
          _data[`addons[${index + 1}]items[${itemIndex + 1}]fee`] = item.fee
        })
      })

      const apiToCall = isAdd ? api.addDishApi : api.updateDishApi
      apiToCall(_data)
        .then(({ok}) => {
          if (ok) {
            toast({
              title: 'Success',
              description: `Your dish has been ${isAdd ? 'added' : 'updated'} successfully`,
              status: 'success',
              duration: 3000
            })
            api.fetchUserApi()
          } else {
            toast({
              title: 'Error',
              description: `Your dish failed to ${isAdd ? 'add' : 'update'}`,
              status: 'error',
              duration: 3000
            })
          }
        })
    }
  }

  return <Flex direction={'column'} boxShadow={'lg'}>
    <Flex gap={2} alignItems={'center'} p={4} borderBottom={'1px solid'} borderColor={'gray.200'}>
      <IoArrowBackCircle onClick={onCancel} size={30}/>
      <Text>{isAdd ? 'Add New Dish' : 'Edit Dish'}</Text>
    </Flex>
    <Flex direction={'column'} alignItems={'center'}>
      <Flex direction={'column'} alignItems={'center'} gap={4} p={4} w={{base: '90%', md: '60%'}}>
        <Flex justifyContent={'center'} gap={4}>
          {images.map((image, id) => <Box w={24} h={24} position={'relative'} key={id}>
            <Avatar src={image} w={24} h={24}/>
            <Flex
              position={'absolute'}
              top={1}
              right={1}
              zIndex={100}
              bg={'white'}
              borderRadius={'50%'}
              cursor={'pointer'}
              w={6}
              h={6}
              justifyContent={'center'}
              alignItems={'center'}
              onClick={() => imageRefs[id].current?.click()}
            >
              <BiPencil/>
            </Flex>
            <Input type={'file'} display={'none'} ref={imageRefs[id]} onChange={(e) => changePhoto(e.target.files[0], id)} accept={'.png,.jpg,.bmp,.gif,.jpeg'}/>
          </Box>)}
        </Flex>
        <FormControl>
          <FormLabel>CATEGORY</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data.category} onChange={e => changeData("category", e.target.value)}/>
        </FormControl>
        <FormControl>
          <FormLabel>NAME OF THE DISH</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data.name} onChange={e => changeData("name", e.target.value)}/>
        </FormControl>
        <FormControl>
          <FormLabel>DESCRIPTION</FormLabel>
          <Textarea bg={'gray.100'} border={'none'} rows={4}
                    value={data['description']} onChange={e => changeData("description", e.target.value)}/>
        </FormControl>
        <FormControl>
          <FormLabel>PRICE</FormLabel>
          <Input type={'number'} bg={'gray.100'} border={'none'}
                 value={data['price']} onChange={e => changeData("price", e.target.value)}/>
        </FormControl>
        <FormControl>
          <FormLabel>SKU NUMBER</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data['sku_number']} onChange={e => changeData("sku_number", e.target.value)}/>
        </FormControl>

        <Flex direction={'column'} gap={2} w={'100%'}>
          {addons.map((addon, index) => <Addon key={index} addon={addon} onChange={val => changeAddon(index, val)}/>)}
          <Flex borderTopWidth={1} pt={2}>
            <Text
              color={'primary.500'}
              cursor={'pointer'}
              onClick={addNewAddon}
            >
              Add Ons +
            </Text>
          </Flex>
        </Flex>

        <Flex
          mt={10}
          w={'100%'}
          justifyContent={'center'}
          gap={4}
        >
          <Button w={'80%'} h={14} fontWeight={400}
                  onClick={onCancel}
          >
            Cancel
          </Button>
          <Button bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                  onClick={save} disabled={!changed}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
}


const Addon = ({addon, onChange}) => {
  const [data, setData] = useState({
    title: addon?.title || '',
    required: addon?.required || false,
    number_of_items: addon?.number_of_items || 0,
    items: addon?.items || []
  })

  const changeData = (key, value) => {
    setData({...data, [key]: value})
    onChange({...data, [key]: value})
  }

  const onChangeItem = (index, key, value) => {
    console.log('items', addon.items, index, key, value)

    let _items = addon.items.slice(0)
    console.log('_items', _items[index][key])
    const _newItem = {..._items[index], [key]: value}
    _items[index] = _newItem
    changeData("items", _items)
  }

  const onAddNewItem = () => {
    if (data.items.length < data.number_of_items) {
      let _items = [...data.items]
      _items.push({name: '', fee: 0})
      changeData("items", _items)
    }
  }

  return <Flex direction={'column'} gap={3} borderTopWidth={1} pt={2}>
    <FormControl>
      <FormLabel>TITLE</FormLabel>
      <Input type={'text'} bg={'gray.100'} border={'none'}
             value={data.title} onChange={e => changeData("title", e.target.value)}/>
    </FormControl>
    <FormControl>
      <FormLabel>NUMBER OF ITEMS</FormLabel>
      <Input type={'number'} bg={'gray.100'} border={'none'}
             value={data.number_of_items} onChange={e => changeData("number_of_items", e.target.value)}/>
    </FormControl>
    <FormControl>
      <FormLabel>IS THIS REQUIRED?</FormLabel>
      <Switch isChecked={data.required} onChange={e => changeData("required", e.target.checked)}/>
    </FormControl>
    {
      data.items.map((item, index) => <Flex direction={'column'} key={index}>
        <Flex gap={2}>
          <FormControl>
            <FormLabel>ITEM NAME</FormLabel>
            <Input type={'text'} bg={'gray.100'} border={'none'}
                   value={item.name} onChange={e => onChangeItem(index, "name", e.target.value)}/>
          </FormControl>
          <FormControl>
            <FormLabel>FEE</FormLabel>
            <Input type={'number'} bg={'gray.100'} border={'none'}
                   value={item.fee} onChange={e => onChangeItem(index, "fee", e.target.value)}/>
          </FormControl>
        </Flex>
      </Flex>)
    }
    <Flex justifyContent={'space-between'}>
      <Text color={'primary.500'} cursor={'pointer'} onClick={onAddNewItem}>
        Add Item +
      </Text>
      <Text color={'red.500'} cursor={'pointer'} onClick={() => onChange(null)}>
        Remove
      </Text>
    </Flex>
  </Flex>
}
