import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, FormControl, FormLabel, Input, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {useAdminApi} from "../../../services/fasterDriver";

export default function AddKeywordDrawer({data, onFinish}) {
  const visible = data !== null
  const isEdit = data?.id !== undefined

  const [name, setName] = useState(data?.name || '')
  const [pending, setPending] = useState(false)
  const api = useAdminApi()
  const toast = useToast()

  useEffect(() => {
    setName(data?.name || '')
    setPending(false)
  }, [data])

  const close = () => {
    onFinish()
  }

  const save = () => {
    if (name === '') {
      toast({
        title: 'Error',
        description: 'Please enter keyword',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setPending(true)
    if (isEdit) {
      api.updateHotKeyword(data.id, {name}).then(res => {
        toast({
          title: 'Success',
          description: 'Keyword updated',
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
      api.addHotKeyword({name}).then(res => {
        toast({
          title: 'Success',
          description: 'Keyword added',
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
            <Box fontSize={18} fontWeight={600}>{isEdit ? 'Edit' : 'Add'} Keyword</Box>
          </Flex>
          <Flex direction={'column'} gap={4}>
            <FormControl>
              <FormLabel>KEYWORD</FormLabel>
              <Input
                bg={'gray.100'}
                border={'none'}
                placeholder={'Enter keyword'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>
        <Button bg={'primary.500'} color={'white'} px={12} borderRadius={10} onClick={save} isLoading={pending}>
          {isEdit ? 'Save' : 'Add'} Keyword
        </Button>
      </Flex>
    </DrawerContent>
  </Drawer>
}


