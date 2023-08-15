import {DeleteIcon} from "@chakra-ui/icons";
import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Image, Textarea, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";
import help from "../../assets/svg/help.svg"
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import {closeCart, emptyCart, removeDishFromCart, removeOrdersByRestaurant} from "../../reducers/cart";
import {useApi} from "../../services/fasterDriver";
import {address2Text} from "../../utils/data";
import AddPayment from "./AddPayment";

const STEP = {
  CART: 0,
  PAYMENT: 1,
  ADD_CARD: 2,
}
export default function Cart() {
  const dispatch = useDispatch()
  const {visible, activeRestaurant, orderMap, deliveryAddress} = useSelector(state => state.cart)

  const order = orderMap[activeRestaurant?.id] || {}
  const orderPrice = Math.round(Object.keys(order).reduce((acc, dishId) => {
    const item = order[dishId]
    return acc + (item?.details?.price || 0) * (item?.quantity || 0)
  }, 0) * 100) / 100
  const fee = orderPrice > 0 ? 5.88 : 0
  const total = Math.round((orderPrice + fee) * 100) / 100

  const [step, setStep] = useState(STEP.CART)

  const [payments, setPayments] = useState([])
  const [activePaymentId, setActivePaymentId] = useState(null)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [pending, setPending] = useState(false)

  const api = useApi()
  const toast = useToast()

  const fetchPayments = () => {
    api.getMyPaymentMethodsApi()
      .then(({data, ok}) => {
        // console.log('payments', data)
        if (ok) {
          setPayments(data?.data || [])
        }
      })
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const close = () => {
    dispatch(closeCart())
  }

  const _renderCart = () => {
    return <Flex w={'100%'} h={'100%'} direction={'column'} overflowY={'auto'}>
      <Flex fontSize={24} fontWeight={600} p={4}>
        {activeRestaurant?.name}
      </Flex>
      <Flex p={2} gap={4}>
        <Button variant={'outline'} fontSize={14} borderRadius={20} borderColor={'black'} onClick={close}>Add Items</Button>
        {/*<Button variant={'outline'} fontSize={14} borderRadius={20} borderColor={'black'}>Group Order</Button>*/}
      </Flex>
      <Flex w={'100%'} bg={'gray.300'} px={4} py={2}>
        Items
      </Flex>
      <Box p={2}>
        {Object.keys(order).map((dishId) => {
          const item = order[dishId]
          if (item?.details?.name) {
            return <Flex
              key={'dish-' + dishId}
              justifyContent={'space-between'}
              alignItems={'center'}
              px={2}
            >
              <Flex gap={2} w={'80%'}>
                <Image src={item?.details?.image_1 || help} alt={item?.details?.name} mb={2} w={14} h={14}/>
                <Flex direction={'column'} w={'74%'}>
                  <Flex gap={1}>
                    {item?.quantity > 1 && <Box color={'primary.500'}>{item?.quantity}x</Box>}
                    {item?.details?.name}
                  </Flex>
                  <Box noOfLines={2} fontSize={14} color={'gray.900'} fontWeight={300}>
                    {item?.details?.description}
                  </Box>
                </Flex>
              </Flex>
              <Flex gap={2} alignItems={'center'}>
                <Box>$ {Number(item?.quantity * item?.details?.price).toFixed(2)}</Box>
                <DeleteIcon color={'red.400'} cursor={'pointer'} onClick={() => {
                  dispatch(removeDishFromCart({
                    restaurantId: activeRestaurant?.id, dishId
                  }))
                }}/>
              </Flex>
            </Flex>
          } else {
            return null
          }
        })}
      </Box>
      <Flex direction={'column'} gap={1} px={6}>
        <Flex justifyContent={'space-between'}>
          <Box>Price</Box>
          <Box>$ {orderPrice}</Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Box>Fee</Box>
          <Box>$ {fee}</Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Box>Total</Box>
          <Box>$ {total}</Box>
        </Flex>
      </Flex>
      <Flex w={'100%'} bg={'gray.300'} px={4} py={2} my={4}>
        Address
      </Flex>
      <Flex px={4}>
        <Box w={'100%'} p={2} color={'gray.600'} fontSize={14}>
          {address2Text(deliveryAddress)}
        </Box>
        <Button
          color={'white'}
          bg={'black'}
          h={8}
          fontSize={12}
        >
          Other
        </Button>
      </Flex>
      <Flex direction={'column'} gap={1} px={4} my={2}>
        <Box>SPECIAL INSTRUCTIONS</Box>
        <Textarea
          resize={'none'}
          bg={'gray.100'}
          border={'none'}
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
        />
      </Flex>

      <Flex justifyContent={'center'} my={4}>
        <Button
          w={'60%'}
          colorScheme={'primary'}
          onClick={async () => {
            if (!deliveryAddress) {
              toast({
                title: 'Error',
                description: 'Please select delivery address',
                status: 'error',
              })
              return
            }

            let _deliveryAddress = deliveryAddress
            if (!_deliveryAddress.id) {
              try {
                const {data, ok} = await api.addAddressApi({
                  'customer.addresses[0].street': _deliveryAddress.street,
                  'customer.addresses[0].city': _deliveryAddress.city,
                  'customer.addresses[0].state': _deliveryAddress.state,
                  'customer.addresses[0].zip_code': _deliveryAddress.zip_code,
                })
                if (ok)
                  _deliveryAddress = data
              } catch (e) {
                console.log('addAddressApi', e)
                return toast({
                  title: 'Error',
                  description: 'We could not use your address. Please try again with other address.',
                  status: 'error',
                })
              }
            }

            let _data = {
              restaurant: activeRestaurant?.id,
              address: _deliveryAddress?.id,
              special_instructions: specialInstructions,
            }
            let count = 0
            Object.keys(order).forEach((dishId) => {
              const item = order[dishId]
              if (item?.details?.name) {
                _data[`dishes[${count}]dish`] = dishId
                _data[`dishes[${count}]quantity`] = item?.quantity
                count++
              }
            })
            if (count === 0) {
              toast({
                title: 'Error',
                description: 'Please add items to cart',
                status: 'error',
              })
              return
            }

            setPending(true)
            api.createOrderApi(_data)
              .then(({data, ok}) => {
                console.log('createOrder', data)
                if (ok) {
                  setOrderId(data?.id)
                  setStep(STEP.PAYMENT)
                  dispatch(emptyCart())
                } else {
                  toast({
                    title: 'Error',
                    description: data,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  })
                }
              })
              .finally(() => {
                setPending(false)
              })
          }}
          h={14}
          isLoading={pending}
        >Confirm</Button>
      </Flex>
    </Flex>
  }

  const _renderPayment = () => {
    return <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
      <Flex direction={'column'} h={'80%'}>
        <Flex gap={2} alignItems={'center'}>
          <Flex bg={'black'} color={'white'} h={6} w={6} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} cursor={'pointer'} onClick={() => setStep(STEP.CART)}>
            <BiLeftArrowAlt/>
          </Flex>
          <Box fontSize={18} fontWeight={600}>Payment</Box>
        </Flex>
        <Flex p={8} direction={'column'} gap={6}>
          <Flex justifyContent={'space-between'} w={'100%'}>
            <Box>Total</Box>
            <Box>${total}</Box>
          </Flex>
          <Flex justifyContent={'center'} direction={'column'} gap={4}>
            {payments.map((payment) => <Flex
              key={payment.id}
              borderRadius={10}
              bg={'gray.100'}
              gap={2}
              py={2}
              px={4}
              direction={'column'}
              cursor={'pointer'}
              onClick={() => setActivePaymentId(payment.id)}
              border={activePaymentId === payment.id ? '1px solid black' : 'none'}
            >
              <Flex justifyContent={'space-between'}>
                <Box textTransform={'capitalize'}>{payment?.card?.brand} card</Box>
              </Flex>
              <Flex gap={2} alignItems={'center'}>
                <Image src={payment?.card?.image || help} alt={payment?.card?.brand} w={8} h={8}/>
                <Box>**** **** **** {payment?.card?.last4}</Box>
              </Flex>
            </Flex>)}
          </Flex>
          <Button variant={'outline'} h={14} onClick={() => setStep(STEP.ADD_CARD)}>+ Add New</Button>
        </Flex>
      </Flex>

      <Flex justifyContent={'center'} gap={2}>
        <Button w={'30%'} bg={'red.600'} color={'white'} h={14} disabled={activePaymentId === null}
                onClick={() => {
                  setAlertTitle('Remove Card')
                  setAlertMessage('Are you sure you want to remove this card?')
                }}>
          Remove
        </Button>
        <Button w={'60%'} bg={'primary.500'} color={'white'} h={14} disabled={activePaymentId === null}
                onClick={() => {
                  api.payForOrderApi({
                    payment_method: activePaymentId,
                    order: orderId
                  })
                    .then(({data, ok}) => {
                      console.log('payForOrderApi', data)
                      if (ok) {
                        dispatch(removeOrdersByRestaurant(activeRestaurant?.id))
                        dispatch(closeCart())
                        toast({
                          title: 'Success',
                          description: 'Your order has been placed',
                          status: 'success',
                        })
                      } else {
                        toast({
                          title: 'Error',
                          description: data?.detail || 'Something went wrong',
                          status: 'error',
                          duration: 3000,
                          isClosable: true,
                        })
                      }
                    })
                }}
        >Pay</Button>
      </Flex>
    </Flex>
  }

  const _renderAddCard = () => {
    return <AddPayment onFinished={() => {
      setStep(STEP.PAYMENT)
    }}/>
  }
  const renderContent = () => {
    switch (step) {
      case STEP.CART:
        return _renderCart()
      case STEP.PAYMENT:
        return _renderPayment()
      case STEP.ADD_CARD:
        return _renderAddCard()
      default:
        break
    }
    return null
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
    <ConfirmDialog isOpen={alertTitle !== ''}
                   onClose={() => setAlertTitle('')} title={alertTitle} message={alertMessage}
                   onOk={() => {
                     api.removePaymentMethodApi(activePaymentId)
                       .then(() => {
                         setAlertTitle('')
                         setAlertMessage('')
                         setActivePaymentId(null)
                         fetchPayments()
                       })
                   }}
    />
  </Drawer>
}


