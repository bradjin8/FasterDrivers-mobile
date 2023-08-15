import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Heading, useToast, Text, Textarea, Image} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {Rating} from "react-simple-star-rating";
import {useApi} from "../../../services/fasterDriver";

const FORM_TYPE = {
  RESTAURANT: 1,
  DRIVER: 2,
}
export default function RateOrderDrawer({order, onFinish}) {
  const visible = order !== null

  const [ratingR, setRatingR] = useState(0)
  const [contextR, setContextR] = useState('')
  const [ratingD, setRatingD] = useState(0)
  const [contextD, setContextD] = useState('')
  const [pendingR, setPendingR] = useState(false)
  const [pendingD, setPendingD] = useState(false)

  const [reviewedR, setReviewedR] = useState(false)
  const [reviewedD, setReviewedD] = useState(false)

  const api = useApi()
  const toast = useToast()

  useEffect(() => {
    setReviewedR(order?.restaurant_reviewed)
    setReviewedD(order?.driver_reviewed)
  }, [order])

  useEffect(() => {
    if (reviewedR && reviewedD) {
      onFinish()
    }
  }, [reviewedD, reviewedR])

  const submitRate = (isRes) => {
    const rating = isRes ? ratingR : ratingD
    const context = isRes ? contextR : contextD

    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select rating',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (context === '') {
      toast({
        title: 'Error',
        description: 'Please enter comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    isRes ? setPendingR(true) : setPendingD(true)
    const rateApi = isRes ? api.rateRestaurantApi : api.rateDriverApi
    let data = {
      order: order?.id,
      rating,
      context,
    }
    if (isRes) {
      data['restaurant'] = order?.restaurant?.id
    } else {
      data['driver'] = order?.driver?.driver?.id
    }
    rateApi(data)
      .then(({data, ok}) => {
        console.log('rate', data)
        if (ok) {
          toast({
            title: 'Success',
            description: 'Your review has been submitted',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          isRes ? setReviewedR(true) : setReviewedD(true)
        } else {
          toast({
            title: 'Error',
            description: data?.message || 'Something went wrong',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      })
      .finally(() => {
        isRes ? setPendingR(false) : setPendingD(false)
      })
  }
  const close = () => {
    onFinish()
  }

  console.log('order', order)
  const _renderForm = (type = FORM_TYPE.RESTAURANT) => {
    const isRes = type === FORM_TYPE.RESTAURANT

    return <Flex p={8} direction={'column'} gap={6} w={{
      base: '100%',
      md: '80%',
    }} mx={'auto'}>
      {isRes ? <Flex justifyContent={'center'} w={'100%'}>
        <Heading size={'md'} textAlign={'center'}>How Was <br/>"{order?.restaurant?.name}" Restaurant?</Heading>
      </Flex> : <Flex alignItems={'center'} w={'100%'} direction={'column'} gap={2}>
        <Image src={order?.driver?.driver?.photo} w={'54px'} h={'54px'} borderRadius={'50%'}/>
        <Heading size={'md'} textAlign={'center'}>Rate {order?.driver?.name}'s Delivery</Heading>
      </Flex>}
      <Flex justifyContent={'center'} direction={'column'} gap={4}>
        <Flex gap={2} w={'100%'}>
          <Text>Tap to Rate: </Text>
          <Flex w={'60%'} style={{direction: 'ltr', touchAction: 'none'}}>
            <Rating
              onClick={(rate) => isRes ? setRatingR(rate) : setRatingD(rate)}
              initialValue={0}
              SVGstrokeColor={'#0093D9'}
              SVGstorkeWidth={1}
              allowFraction={true}
              fillColor={'#0093D9'}
              size={24}
            />
          </Flex>
        </Flex>
        <Textarea
          placeholder={'Enter your comment'}
          value={isRes ? contextR : contextD}
          onChange={(e) => isRes ? setContextR(e.target.value) : setContextD(e.target.value)}
          borderRadius={10}
          borderColor={'black'}
          rows={5}
          resize={'none'}
        />
        <Flex justifyContent={'center'} gap={2}>
          <Button w={'60%'} bg={'primary.500'} color={'white'} h={14} disabled={isRes ? pendingR : pendingD}
                  onClick={() => submitRate(isRes)}
          >Submit</Button>
        </Flex>
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
      <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
        <Flex direction={'column'} gap={8}>
          <Flex gap={2} alignItems={'center'}>
            <Flex bg={'black'} color={'white'} h={6} w={6} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} cursor={'pointer'} onClick={close}>
              <BiLeftArrowAlt/>
            </Flex>
            <Box fontSize={18} fontWeight={600}>Rate Your Order</Box>
          </Flex>
          {!reviewedR && _renderForm(FORM_TYPE.RESTAURANT)}
          {!reviewedD && _renderForm(FORM_TYPE.DRIVER)}
        </Flex>
      </Flex>
    </DrawerContent>
  </Drawer>
}


