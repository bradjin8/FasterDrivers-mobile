import {Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Image, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import help from "../../../assets/svg/help.svg"
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {useApi} from "../../../services/fasterDriver";
import AddPayment from "../AddPayment";

const STEP = {
  PAYMENT: 1,
  ADD_CARD: 2,
}
export default function PayOrderDrawer({order, onFinish}) {
  const visible = order !== null
  const total = order?.total

  const [step, setStep] = useState(STEP.PAYMENT)

  const [payments, setPayments] = useState([])
  const [activePaymentId, setActivePaymentId] = useState(null)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [pending, setPending] = useState(false)

  const api = useApi()
  const toast = useToast()

  const fetchPayments = () => {
    api.getMyPaymentMethodsApi()
      .then(({data, ok}) => {
        console.log('payments', data)
        if (ok) {
          setPayments(data?.data || [])
        }
      })
  }

  useEffect(() => {
    fetchPayments()
  }, [step])

  const close = () => {
    onFinish()
  }
  const _renderPayment = () => {
    return <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
      <Flex direction={'column'} h={'80%'}>
        <Flex gap={2} alignItems={'center'}>
          <Flex bg={'black'} color={'white'} h={6} w={6} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} cursor={'pointer'} onClick={() => setStep(STEP.PAYMENT)}>
            <BiLeftArrowAlt/>
          </Flex>
          <Box fontSize={18} fontWeight={600}>Pay For Order</Box>
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
                }}
        >
          Remove
        </Button>
        <Button w={'60%'} bg={'primary.500'} color={'white'} h={14} disabled={activePaymentId === null}
                onClick={() => {
                  setPending(true)
                  api.payForOrderApi({
                    payment_method: activePaymentId,
                    order: order?.id,
                  })
                    .then(({data, ok}) => {
                      console.log('payForOrderApi', data)
                      if (ok) {
                        toast({
                          title: 'Payment success',
                          description: 'Your order has been placed',
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        })
                        onFinish()
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
                    .finally(() => {
                      setPending(false)
                    })
                }}
                isLoading={pending}
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


