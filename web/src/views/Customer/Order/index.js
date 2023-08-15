import {Box, Button, Divider, Flex, Grid, GridItem, Heading, Image, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {Rating} from "react-simple-star-rating";
import {ORDER_STATUS} from "../../../constants/orders";
import {useApi} from "../../../services/fasterDriver";
import PayOrderDrawer from "./PayOrderDrawer";
import RateOrderDrawer from "./RateOrderDrawer";

export default function CustomerOrders() {
  const api = useApi()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [payOrder, setPayOrder] = useState(null)
  const [rateOrder, setRateOrder] = useState(null)

  const fetchOrders = () => {
    setLoading(true)
    api.getOrdersApi()
      .then(({data, ok}) => {
        if (ok) {
          setOrders(data?.sort((a, b) => a.updated_at < b.updated_at ? 1 : -1))
        } else {
          setOrders([])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const unpaidOrders = orders.filter(it => it.status === ORDER_STATUS.Unpaid)
  const pendingOrders = orders.filter(it => [ORDER_STATUS.Pending, ORDER_STATUS.InTransit, ORDER_STATUS.InProgress,].includes(it.status))
  const completedOrders = orders.filter(it => [ORDER_STATUS.Delivered].includes(it.status))

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}} gap={0}>
      {
        unpaidOrders.length > 0 && <>
          <Heading size={'lg'} my={2}>Unpaid Orders</Heading>
          {unpaidOrders.map((order) => <Order order={order} key={order.id} firstAction={() => setPayOrder(order)}/>)}
          <Divider/>
        </>
      }
      {
        pendingOrders.length > 0 && <>
          <Heading size={'lg'} my={2}>Pending Orders</Heading>
          {pendingOrders.map((order) => <Order order={order} key={order.id}/>)}
          <Divider/>
        </>
      }
      {
        completedOrders.length > 0 && <>
          <Heading size={'lg'} my={2}>Completed Orders</Heading>
          {orders.filter(it => [ORDER_STATUS.Delivered].includes(it.status)).map((order) => <Order order={order} key={order.id} secondAction={() => setRateOrder(order)}/>)}
        </>
      }

      <PayOrderDrawer order={payOrder} onFinish={() => setPayOrder(null)}/>
      <RateOrderDrawer order={rateOrder} onFinish={() => {
        setRateOrder(null)
        fetchOrders()
      }}/>
    </Flex>
  )
}


function Order({order, firstAction, secondAction}) {
  const {id, status, restaurant, dishes, total, restaurant_reviewed, driver_reviewed, special_instructions} = order

  const itemCount = dishes.reduce((acc, dish) => acc + dish.quantity, 0)

  const [dishDetails, setDishDetails] = useState([])

  const api = useApi()

  const fetchDishDetails = () => {
    Promise.all(dishes.map(dish => api.getDishApi(dish.dish)))
      .then((responses) => {
        const dishDetails = responses.map(({data, ok}) => {
          return {
            ...data,
            quantity: dishes.find(it => it.dish === data.id)?.quantity
          }
        })
        setDishDetails(dishDetails)
      })
  }

  useEffect(() => {
    fetchDishDetails()
  }, [])

  return (
    <Grid
      templateColumns={{base: "1fr", md: "repeat(4, 1fr)"}}
      gridGap={0}
      py={4}
      // borderTopWidth={1}
      borderBottomWidth={1}
    >
      <GridItem colSpan={3}>
        <Flex w={'100%'} gap={8}>
          <Flex w={'30%'}>
            <Image src={restaurant?.photo} w={'260px'} h={'200px'} borderRadius={10}/>
          </Flex>
          <Flex direction={'column'} gap={2} w={'70%'}>
            <Flex justifyContent={'space-between'} w={'100%'}>
              <Flex flexDirection='column'>
                <Box>{restaurant?.name}</Box>
                <Text fontSize={'12px'} color={'gray.500'}>Total ${total} For {itemCount} Item{itemCount > 1 ? 's' : ''}</Text>
              </Flex>
              {restaurant?.rating && <Flex w={'40%'} gap={2}>
                <Rating
                  size={24}
                  iconsCount={1}
                  initialValue={restaurant.rating / 5}
                  readonly={true}
                  SVGstrokeColor={'#0093D9'}
                  SVGstorkeWidth={1}
                  allowFraction={true}
                  fillColor={'#0093D9'}
                />
                <Text>{Number(restaurant?.rating).toFixed(1)}</Text>
              </Flex>}
            </Flex>
            <Flex direction={'column'} gap={2} w={'100%'}>
              {dishDetails.map(dd => (<Flex gap={2} key={dd?.id}>
                <Image src={dd.image_1} h={'60px'} w={'60px'} objectFit={'cover'}/>
                <Flex flexDirection={'column'} gap={1} w={'70%'}>
                  <Flex gap={1}>
                    {dd?.quantity > 1 ? <Text color={'primary.500'}>{dd?.quantity}x</Text> : ''} {dd?.name}
                  </Flex>
                  <Text fontSize={'12px'} color={'gray.500'} noOfLines={2}>{dd?.description}</Text>
                </Flex>
              </Flex>))}
            </Flex>
            <Flex direction={'column'} gap={0} w={'100%'}>
              <Text fontSize={'12px'}>Special Instructions:</Text>
              <Text fontSize={'12px'} color={'gray.500'} noOfLines={2}>{special_instructions}</Text>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex flexDirection={'column'} gap={4}>
          {status === ORDER_STATUS.Unpaid && <Button bg={'primary.500'} color={'white'} w={'200px'} onClick={firstAction}>Pay</Button>}
          {status === ORDER_STATUS.Delivered && (!restaurant_reviewed || !driver_reviewed) && <Button variant={'outline'} borderColor={'black'} w={'200px'} onClick={secondAction}>Rate Your Order</Button>}
        </Flex>
      </GridItem>
    </Grid>
  )
}
