import {Button, Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {BiBadgeCheck} from "react-icons/bi";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";
import SettingsLayout from "./index";

export default function StripeConnect() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const {user} = useSelector(state => state.auth)
  const api = useApi()

  const type = user?.type?.toLowerCase() || 'restaurant'

  useEffect(() => {
    fetchStripeStatus()
  }, [])

  const fetchStripeStatus = () => {
    setLoading(true)
    api.checkStripeAccountApi()
      .then(({ok}) => {
        setEnabled(ok)
      })
      .finally(() => setLoading(false))
  }

  const connectStripe = () => {
    setLoading(true)
    api.connectStripeAccountApi()
      .then(({data, ok}) => {
        if (ok) {
          window.open(data?.link?.url, '_current')
        }
      })
      .finally(() => setLoading(false))
  }

  return <SettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '60%'}} alignItems={'center'} gap={6}>
      <Heading fontSize='2xl' color={'primary.500'}>Set Up Stripe Payment</Heading>
      <Flex direction={'column'} gap={4} color={'primary.500'}>
        <Text fontSize={16} fontWeight={'700'}>IN ORDER TO COLLECT CREDIT CARD PAYMENTS YOU WILL HAVE TO SET UP YOUR STRIPE ACCOUNT.</Text>
        <Text fontWeight={500}>
          Taking payments with Stripe is easy. Just click on the button below and follow the steps and Set Up Stripe.
        </Text>
      </Flex>
      <Flex
        w={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        h={100}
      >
        {
          loading ? <Spinner size={'lg'} color={'primary.500'}/> :
            enabled ? <Flex direction={'column'} gap={4} alignItems={'center'}>
                <BiBadgeCheck fontSize={50} color={'green'}/>
                <Text fontWeight={300}>Your Stripe account is set up and ready to go!</Text>
              </Flex> :
              <Button bg={'primary.500'} color={'white'} onClick={connectStripe} w={'80%'}>Set Up Stripe Payment</Button>
        }
      </Flex>
    </Flex>
  </SettingsLayout>
}
