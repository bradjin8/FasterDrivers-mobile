import {Box, Button, Flex, FormControl, FormLabel, Image, Input, Textarea, useToast} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {BiPencil} from "react-icons/bi";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";
import SettingsLayout from "../../Common/Settings";

export default function MyRestaurant() {
  const {user: {restaurant}} = useSelector(state => state.auth)
  const imageRef = useRef(null)
  const api = useApi()
  const toast = useToast()

  const [data, setData] = useState({})
  const [photo, setPhoto] = useState(restaurant?.photo || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    setData({
      "restaurant.name": restaurant?.name,
      "restaurant.street": restaurant?.street || '',
      "restaurant.city": restaurant?.city || '',
      "restaurant.state": restaurant?.state || '',
      "restaurant.zip_code": restaurant?.zip_code || '',
      "restaurant.phone": restaurant?.phone || '',
      "restaurant.website": restaurant?.website || '',
      "restaurant.description": restaurant?.description || '',
      "restaurant.type": restaurant?.type || '',
      "restaurant.ein_number": restaurant?.ein_number || '',
      // "restaurant.photo": restaurant?.photo,
    })
    setPhoto(restaurant?.photo || '')
  }, [restaurant])

  const changeData = (key, value) => {
    setData({...data, [key]: value})
    setChanged(true)
  }

  const changePhoto = (e) => {
    const file = e.target.files[0]
    if (FileReader && file) {
      const fr = new FileReader()
      fr.onload = () => {
        setPhoto(fr.result)
        setChanged(true)
        setPhotoFile(file)
      }
      fr.readAsDataURL(file)
    }
  }

  const save = () => {
    setChanged(false)
    let _data = {...data}
    if (photoFile) {
      _data['restaurant.photo'] = photoFile
    }
    if (!_data['restaurant.website']?.startsWith('http')) {
      _data['restaurant.website'] = 'https://' + _data['restaurant.website']
    }

    api.updateProfileApi(_data)
      .then(({ok, data}) => {
        if (ok) {
          toast({
            title: 'Update successful',
            description: 'Your profile has been updated successfully',
            status: 'success',
            duration: 3000
          })
          api.fetchUserApi()
        } else {
          toast({
            title: 'Update failed',
            description: 'Your profile failed to update',
            status: 'error',
            duration: 3000
          })
        }
      })
      .finally(() => {
        setChanged(false)
      })
  }

  console.log('data', data)

  return <SettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '60%'}} alignItems={'center'} gap={4}>
      <Flex justifyContent={'center'}>
        <Box w={24} h={24} position={'relative'}>
          <Image src={photo} w={24} h={24} borderRadius={'50%'} objectFit={'cover'}/>
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
            onClick={() => imageRef.current?.click()}
          >
            <BiPencil/>
          </Flex>
          <Input type={'file'} display={'none'} ref={imageRef} onChange={changePhoto} accept={'.png,.jpg,.bmp,.gif,.jpeg'} />
        </Box>
      </Flex>
      <FormControl>
        <FormLabel>RESTAURANT NAME</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data['restaurant.name']} onChange={e => changeData("restaurant.name", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>STREET</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data['restaurant.street']} onChange={e => changeData("restaurant.street", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>CITY</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data['restaurant.city']} onChange={e => changeData("restaurant.city", e.target.value)}/>
      </FormControl>
      <Flex justifyContent={'space-between'} w={'100%'} gap={4}>
        <FormControl>
          <FormLabel>STATE</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data['restaurant.state']} onChange={e => changeData("restaurant.state", e.target.value)}/>
        </FormControl>
        <FormControl>
          <FormLabel>ZIP CODE</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data['restaurant.zip_code']} onChange={e => changeData("restaurant.zip_code", e.target.value)}/>
        </FormControl>
      </Flex>
      <FormControl>
        <FormLabel>WEBSITE</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data['restaurant.website']} onChange={e => changeData("restaurant.website", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>EIN NUMBER</FormLabel>
        <Input type={'number'} bg={'gray.100'} border={'none'}
               value={data['restaurant.ein_number']} onChange={e => changeData("restaurant.ein_number", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>PHONE NUMBER</FormLabel>
        <Input type={'tel'} bg={'gray.100'} border={'none'}
               value={data['restaurant.phone']} onChange={e => changeData("restaurant.phone", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>TYPE OF THE RESTAURANT</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data['restaurant.type']} onChange={e => changeData("restaurant.type", e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>DESCRIPTION</FormLabel>
        <Textarea bg={'gray.100'} border={'none'} rows={4}
               value={data['restaurant.description']} onChange={e => changeData("restaurant.description", e.target.value)}/>
      </FormControl>
      <Flex
        mt={10}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={save} disabled={!changed}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  </SettingsLayout>
}
