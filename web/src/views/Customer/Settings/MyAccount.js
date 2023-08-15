import {DeleteIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, FormControl, FormLabel, Image, Input, Skeleton, useToast} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {BiPencil} from "react-icons/bi";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";
import {address2Text} from "../../../utils/data";
import SettingsLayout from "../../Common/Settings";
import AddressDrawer from "./AddressDrawer";

export default function MyAccount() {
  const {user} = useSelector(state => state.auth)
  const profile = user.customer || {}
  const toast = useToast()
  const api = useApi()
  const imageRef = useRef(null)

  const [data, setData] = useState({
    name: user.name || '',
    email: user.email || '',
    'customer.phone': profile.phone || '',
  })
  const [photo, setPhoto] = useState(profile?.photo || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [modified, setModified] = useState(false)
  const [pending, setPending] = useState(false)

  const [addresses,setAddresses] = useState([])
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address)
      fetchAddresses()
  }, [address])

  const fetchAddresses = () => {
    setLoading(true)
    api.getAddressesApi()
      .then(({ok, data}) => {
        if (ok) {
          setAddresses(data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const deleteAddress = (id) => {
    setLoading(true)
    api.removeAddressApi(id)
      .then(() => {
        fetchAddresses()
        setLoading(false)
      })
  }

  const changeData = (key, value) => {
    setModified(true)
    setData({...data, [key]: value})
  }

  const changePhoto = (e) => {
    const file = e.target.files[0]
    if (FileReader && file) {
      const fr = new FileReader()
      fr.onload = () => {
        setPhoto(fr.result)
        setModified(true)
        setPhotoFile(file)
      }
      fr.readAsDataURL(file)
    }
  }

  const save = () => {
    setModified(false)
    setPending(true)
    let _data = {...data}
    if (photoFile) {
      _data['customer.photo'] = photoFile
    }

    api.updateProfileApi(data)
      .then(({ok, data}) => {
        if (ok) {
          toast({
            title: 'Success',
            description: 'Profile updated successfully',
            status: 'success',
            duration: 3000,
          })
          api.fetchUserApi()
          setModified(false)
        } else {
          toast({
            title: 'Failed',
            description: data?.details?.[0] || 'Profile was not updated',
            status: 'warning',
            duration: 3000,
          })
        }
      })
      .finally(() => {
        setPending(false)
      })
  }

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
        <FormLabel>FULL NAME</FormLabel>
        <Input type={'text'} bg={'gray.100'} border={'none'}
               value={data.name} onChange={e => changeData('name', e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>EMAIL</FormLabel>
        <Input type={'email'} bg={'gray.100'} border={'none'}
               value={data.email} onChange={e => changeData('email', e.target.value)}/>
      </FormControl>
      <FormControl>
        <FormLabel>PHONE NUMBER</FormLabel>
        <Input type={'tel'} bg={'gray.100'} border={'none'}
               value={data['customer.phone']} onChange={e => changeData('customer.phone', e.target.value)}/>
      </FormControl>

      <Skeleton isLoaded={!loading} w={'100%'}>
        <Flex w={'100%'} direction={'column'} gap={4}>
          <Flex justifyContent={'space-between'}>
            ADDRESSES
          </Flex>
          {addresses.map((a, index) => {
            return <Flex key={index} justifyContent={'space-between'} w={'100%'} px={4}>
              <Flex>
                {address2Text(a)}
              </Flex>
              <Flex gap={2}>
                <BiPencil color={'blue.400'} cursor={'pointer'} onClick={() => setAddress(a)}/>
                <DeleteIcon color={'red.400'} cursor={'pointer'} onClick={() => deleteAddress(a.id)} />
              </Flex>
            </Flex>
          })}
          <Button w={'40%'} h={8} fontWeight={400} fontSize={'sm'} onClick={() => setAddress({})}>
            Add New Address
          </Button>
        </Flex>
      </Skeleton>

      <AddressDrawer address={address} onFinish={() => setAddress(null)} />
      <Flex
        mt={10}
        w={'100%'}
        justifyContent={'center'}
      >
        <Button variant={'primary'} bg={'primary.500'} color={'white'} w={'80%'} h={14} fontWeight={400}
                onClick={save} disabled={!modified} isLoading={pending}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  </SettingsLayout>
}
