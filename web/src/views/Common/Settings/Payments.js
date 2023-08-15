import {Box, Button, Flex, Image, Skeleton, toast, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import help from "../../../assets/svg/help.svg";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {VisaIcon} from "../../../components/Icons/Icons";
import {useApi} from "../../../services/fasterDriver";
import {getCardIcon} from "../../../utils/ui";

export default function Payments({onAdd}) {
  const [activePaymentId, setActivePaymentId] = useState(null)
  const [payments, setPayments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)

  const api = useApi()
  const toast = useToast()

  const removeCard = () => {
    setIsOpen(false)
    setPending(true)
    api.removePaymentMethodApi(activePaymentId)
      .then(() => {
        setActivePaymentId(null)
        fetchPayments()
        toast({
          title: 'Success',
          description: 'Card removed successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .finally(() => {
        setPending(false)
      })
  }
  const fetchPayments = () => {
    setLoading(true)
    api.getMyPaymentMethodsApi()
      .then(({ok, data}) => {
        if (ok) {
          setPayments(data?.data || [])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'} w={'100%'}>
    <Flex direction={'column'} h={'80%'}>
      <Flex p={8} direction={'column'} gap={6}>
          <Flex justifyContent={'center'} direction={'column'} gap={4}>
            {loading && <Skeleton h={20} borderRadius={10}/>}

            {!loading && payments?.map((payment) => <Flex
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
                {getCardIcon(payment?.card?.brand)}
                <Box>**** **** **** {payment?.card?.last4}</Box>
              </Flex>
            </Flex>)}
          </Flex>
        <Button variant={'outline'} h={14} onClick={onAdd}>+ Add New</Button>
      </Flex>
    </Flex>

    <Flex justifyContent={'center'} gap={2}>
      <Button w={'80%'} bg={'red.600'} color={'white'} h={14} disabled={pending || activePaymentId === null}
              onClick={() => {
                setIsOpen(true)
              }}
              isLoading={pending}
      >
        Remove
      </Button>
    </Flex>
    <ConfirmDialog isOpen={isOpen} title={'Remove Card'} message={'Are you sure you want to remove this card?'}
                   onClose={() => setIsOpen(false)}
                   onOk={removeCard}
    />
  </Flex>
}
