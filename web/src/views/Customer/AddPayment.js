import {Box, Button, Flex, FormControl, FormLabel, Image, Input, useToast} from "@chakra-ui/react";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import React, {useState} from "react";
import {BiLeftArrowAlt} from "react-icons/bi";
import {useSelector} from "react-redux";
import Payments from "../../assets/img/Payments.png";
import {useApi} from "../../services/fasterDriver";
const stripePromise = loadStripe('pk_test_51N0lDHHuKvl8e8x17JvdYH74CJRg0NL0J7HkA3zCX01uL9hznDEUH8R78GeJjzZ76OC0dzF4RiUaPPB8Uu43zJHC00DPzy6QUK')

export default function AddPayment({onFinished}) {
  const options = {
    mode: 'setup',
    currency: 'usd',
    appearance: {}
  }

  return <Elements stripe={stripePromise} options={options}>
    <AddCard onFinished={onFinished}/>
  </Elements>
}


const AddCard = ({onFinished}) => {
  const stripe = useStripe()
  const elements = useElements()
  const toast = useToast()
  const api = useApi()
  const {user} = useSelector(state => state.auth)

  const [creatingPayment, setCreatingPayment] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name) {
      toast({
        title: 'Error',
        description: 'Please enter card holder name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    if (!stripe || !elements || creatingPayment)
      return

    setCreatingPayment(true)
    const cardElement = elements.getElement(CardElement)

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setCreatingPayment(false)
    } else {
      api.addPaymentMethodApi({
        paymentId: paymentMethod.id,
        name: name
      })
        .then(({ok, data}) => {
          if (ok) {
            toast({
              title: 'Success',
              description: 'Card added successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
            onFinished()
          } else {
            toast({
              title: 'Error',
              description: data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
        })
        .finally(() => {
          setCreatingPayment(false)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex p={4} direction={'column'} justifyContent={'space-between'} h={'100%'}>
        <Flex direction={'column'} h={'80%'}>
          <Flex gap={2} alignItems={'center'}>
            <Flex bg={'black'} color={'white'} h={6} w={6} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} cursor={'pointer'} onClick={onFinished}>
              <BiLeftArrowAlt/>
            </Flex>
            <Box fontSize={18} fontWeight={600}>Add Card</Box>
          </Flex>
          <Flex p={8} direction={'column'} gap={10}>
            <Flex justifyContent={'center'} w={'100%'}>
              <Image src={Payments}/>
            </Flex>
            <FormControl>
              <FormLabel>CARD HOLDER</FormLabel>
              <Input type={'text'} border={'none'} bg={'gray.100'} _focus={{border: 'none'}}
                     value={name} onChange={(e) => setName(e.target.value)}/>
            </FormControl>
            <CardElement/>
          </Flex>
        </Flex>
        <Flex justifyContent={'center'}>
          <Button w={'60%'} bg={'primary.500'} color={'white'} h={14} type={'submit'} disabled={creatingPayment} isLoading={creatingPayment}>Add Card</Button>
        </Flex>
      </Flex>
    </form>
  )
}
