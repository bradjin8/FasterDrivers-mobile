import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, FormControl, FormLabel, Input, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {object, string} from "yup";
import {useApi} from "../../../services/fasterDriver";

const AddressSchema = object().shape({
  'street': string().required('Street is required'),
  'city': string().required('City is required'),
  'state': string().required('State is required'),
  'zip_code': string().required('Zip code is required'),
})

export default function AddressDrawer({address, onFinish}) {
  const visible = address !== null
  const isAdd = address?.id === undefined || address?.id === null
  const [pending, setPending] = useState(false)

  console.log(address, isAdd)

  const api = useApi()
  const toast = useToast()

  const [data, setData] = useState({})

  useEffect(() => {
    setData({
      'street': address?.street || '',
      'city': address?.city || '',
      'state': address?.state || '',
      'zip_code': address?.zip_code || '',
    })
    setPending(false)
  }, [address])
  const changeData = (key, value) => {
    setData({...data, [key]: value})
  }

  const close = () => {
    onFinish()
  }

  const save = () => {
    AddressSchema.validate(data).then(() => {
      setPending(true)
      if (isAdd) {
        let _data = {
          'customer.addresses[0]street': data.street,
          'customer.addresses[0]city': data.city,
          'customer.addresses[0]state': data.state,
          'customer.addresses[0]zip_code': data.zip_code,
        }
        api.addAddressApi(_data).then(({ok, data}) => {
          if (ok) {
            toast({
              title: 'Success',
              description: 'Address added successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          } else {
            toast({
              title: 'Error',
              description: data?.[0],
              status: 'warning',
              duration: 3000,
              isClosable: true,
            })
          }
          onFinish()
        })
          .finally(() => {
            setPending(false)
          })
      } else {
        api.updateAddressApi(address.id, data).then(() => {
          toast({
            title: 'Success',
            description: 'Address updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          onFinish()
        }).catch(err => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }).finally(() => {
          setPending(false)
        })
      }
    }).catch(err => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    })
  }
  const renderContent = () => {
    return <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
      <Flex direction={'column'} h={'80%'} gap={4}>
        <Flex gap={2} alignItems={'center'} mb={8}>
          <Box fontSize={18} fontWeight={600}>{isAdd ? 'Add New Address' : "Edit Address"}</Box>
        </Flex>
        <FormControl>
          <FormLabel>STREET</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data['street']} onChange={e => changeData('street', e.target.value)}/>
        </FormControl>
        <Flex p={0} gap={4} w={'100%'}>
          <FormControl>
            <FormLabel>CITY</FormLabel>
            <Input type={'text'} bg={'gray.100'} border={'none'}
                   value={data['city']} onChange={e => changeData('city', e.target.value)}/>
          </FormControl>
          <FormControl>
            <FormLabel>STATE</FormLabel>
            <Input type={'text'} bg={'gray.100'} border={'none'}
                   value={data['state']} onChange={e => changeData('state', e.target.value)}/>
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel>ZIP CODE</FormLabel>
          <Input type={'text'} bg={'gray.100'} border={'none'}
                 value={data['zip_code']} onChange={e => changeData('zip_code', e.target.value)}/>
        </FormControl>
      </Flex>
      <Flex justifyContent={'center'} gap={2}>
        <Button w={'60%'} bg={'primary.500'} color={'white'} h={14}
                onClick={save} isLoading={pending}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  }

  return <Drawer
    isOpen={visible}
    placement="right"
    onClose={close}
    size={'md'}
  >
    <DrawerOverlay/>
    <DrawerContent>
      <DrawerCloseButton/>
      {renderContent()}
    </DrawerContent>
  </Drawer>
}


