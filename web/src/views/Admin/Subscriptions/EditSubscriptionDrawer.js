import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Select, Stack, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {useAdminApi, useApi} from "../../../services/fasterDriver";

export default function EditSubscriptionDrawer({data, visible, onFinish}) {
  const isEdit = data?.id !== undefined

  const [nickname, setNickname] = useState(data?.nickname || 'PREMIUM')
  const [price, setPrice] = useState(data?.amount / 100 || 0)
  const [duration, setDuration] = useState(data?.duration || '')
  const [pending, setPending] = useState(false)
  const api = useApi()
  const toast = useToast()

  useEffect(() => {
    setNickname(data?.nickname ?? 'PREMIUM')
    setPrice(data?.amount / 100 || 0)
    setDuration(data?.duration || '')
    setPending(false)
  }, [data])

  const close = () => {
    onFinish()
  }

  const save = () => {
    setPending(true)
    if (isEdit) {
      api.updateSubscriptionPrice({
        price_id: data?.id,
        price: price,
        interval: duration,
        nickname: nickname,
      }).then(res => {
        toast({
          title: 'Success',
          description: 'Subscription updated',
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
      })
    } else {
    }
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
      <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
        <Flex direction={'column'} gap={8}>
          <Flex gap={2} alignItems={'center'}>
            <Flex bg={'black'} color={'white'} h={6} w={6} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} cursor={'pointer'} onClick={close}>
              <BiLeftArrowAlt/>
            </Flex>
            <Box fontSize={18} fontWeight={600}>{isEdit ? 'Edit' : 'Add'} Subscription</Box>
          </Flex>
          <Flex direction={'column'} gap={4}>
            <FormControl>
              <FormLabel>NAME</FormLabel>
              <Input
                bg={'gray.100'}
                border={'none'}
                placeholder={'Enter name'}
                value={nickname}
                disabled={true}
                // onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </Flex>
          <Flex gap={2}>
            <FormControl>
              <FormLabel>PRICE</FormLabel>
              <InputGroup>
                <InputLeftAddon children={'$'} bg={'gray.200'}/>
                <Input
                  type={'number'}
                  bg={'gray.100'}
                  border={'none'}
                  placeholder={'Enter Price'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </InputGroup>

            </FormControl>
            <FormControl>
              <FormLabel>&nbsp;</FormLabel>
              <Select value={duration} onChange={e => setDuration(e.target.value)} bg={'gray.100'}>
                <option value={'month'}>Month</option>
                <option value={'year'}>Year</option>
              </Select>
            </FormControl>
          </Flex>
        </Flex>
        <Button bg={'primary.500'} color={'white'} px={12} borderRadius={10} onClick={save} isLoading={pending}>
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Flex>
    </DrawerContent>
  </Drawer>
}


