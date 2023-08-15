import {Button, Flex, Image, Spinner, Text, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ORDER_STATUS} from "../../../constants/orders";
import {setActiveOrder, setNeedToRefresh} from "../../../reducers/ui";
import {useApi} from "../../../services/fasterDriver";
import AssignToDriver from "./AssignToDriver";

export default function OrderDetails() {
  const activeOrder = useSelector(state => state.ui.activeOrder) || {}
  const restaurant = useSelector(state => state.auth.user.restaurant) || {}
  const api = useApi()
  const dispatch = useDispatch()
  const toast = useToast()

  const {id, user, dishes, status, total, tip, taxes, fees, sub_total, special_instructions} = activeOrder
  const totalQuantity = dishes?.reduce((acc, dish) => acc + dish.quantity, 0) || 1

  const [pending, setPending] = useState(false)
  const [isMap, setIsMap] = useState(false)


  useEffect(() => {
    setIsMap(false)
  }, [activeOrder])
  const accept = () => {
    setPending(true)
    api.acceptAnOrderApi(id)
      .then(({ok, data}) => {
        if (ok) {
          dispatch(setActiveOrder(data))
          dispatch(setNeedToRefresh(true))
          toast({
            title: 'Success',
            description: 'Order accepted',
            status: 'success',
          })
        }
      })
      .finally(() => {
        setPending(false)
      })
  }

  const decline = () => {
    setPending(true)
    api.rejectAnOrderApi(id)
      .then(({ok, data}) => {
        if (ok) {
          dispatch(setActiveOrder(data))
          dispatch(setNeedToRefresh(true))
          toast({
            title: 'Success',
            description: 'Order rejected',
            status: 'success',
          })

        }
      })
      .finally(() => {
        setPending(false)
      })
  }

  const renderAction = () => {
    switch (status) {
      case ORDER_STATUS.Pending:
        return <Flex gap={6}>
          <Button colorScheme={'red'} borderRadius={20} onClick={decline}>Decline</Button>
          <Button colorScheme={'green'} borderRadius={20} onClick={accept}>Accept</Button>
        </Flex>
      case ORDER_STATUS.Accepted:
        return <Flex>
          <Button colorScheme={'primary'} onClick={() => {
            setIsMap(true)
          }}>Assign to Driver</Button>
        </Flex>
      default:
        return null
    }
  }

  if (id)
    if (isMap)
      return <AssignToDriver onClose={() => setIsMap(false)}/>
    else
      return (
        <Flex direction={'column'} boxShadow={'lg'} gap={2}>
          <Flex direction={'column'} gap={2} borderBottomWidth={1} p={{base: 1, md: 4}}>
            <Text>{user?.name}</Text>
            <Text>{totalQuantity} Item{totalQuantity > 1 ? 's' : ''}</Text>
          </Flex>
          <Flex direction={'column'} gap={2}>
            {dishes?.map((dish, id) => {
              const dishDetails = restaurant?.dishes?.find(d => d.id === dish.dish) || {}
              const {name, price, description, image_1} = dishDetails
              return <Flex key={'dish-' + id} justifyContent={'space-between'} w={'100%'}>
                <Flex gap={2} w={'74%'}>
                  <Image src={image_1} w={'70px'} h={'70px'} objectFit={'cover'}/>
                  <Flex flexDirection={'column'} minW={'200px'} w={'70%'}>
                    <Text>{name}</Text>
                    <Text noOfLines={2} fontSize={12}>{description}</Text>
                  </Flex>
                </Flex>
                <Flex flexDirection={'column'} alignItems={'flex-end'} justifyContent={'center'} mr={4}>
                  ${price}
                </Flex>
              </Flex>
            })}
          </Flex>
          <Flex direction={'column'} gap={2} p={4}>
            <Flex justifyContent={'space-between'}>
              <Text>Price</Text>
              <Text>${sub_total}</Text>
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Text>Fee</Text>
              <Text>${fees}</Text>
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Text>Tip</Text>
              <Text>${tip}</Text>
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Text>Total</Text>
              <Text>${total}</Text>
            </Flex>
          </Flex>
          <Flex direction={'column'} p={4}>
            <Text>Special Instructions</Text>
            <Text fontSize={14}>{special_instructions}</Text>
          </Flex>
          <Flex h={40} justifyContent={'center'} alignItems={'center'}>
            {pending ? <Spinner color={'primary.500'}/> : renderAction()}
          </Flex>
        </Flex>
      )

  return <Flex></Flex>
}
