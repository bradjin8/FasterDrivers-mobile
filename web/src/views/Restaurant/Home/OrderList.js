import {Avatar, Flex, Skeleton, Text} from "@chakra-ui/react";
import moment from "moment";
import {useEffect, useState} from "react";
import {AiOutlineRight} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {ORDER_STATUS} from "../../../constants/orders";
import {setActiveOrder, setNeedToRefresh} from "../../../reducers/ui";
import {useApi} from "../../../services/fasterDriver";

const Tabs = [
  'New Orders',
  'In Progress',
  'Completed',
]

const StatusByTab = [
  [ORDER_STATUS.Unpaid, ORDER_STATUS.Pending],
  [ORDER_STATUS.Accepted, ORDER_STATUS.InTransit, ORDER_STATUS.InProgress, ORDER_STATUS.DriverAssigned],
  [ORDER_STATUS.Completed, ORDER_STATUS.Rejected, ORDER_STATUS.Delivered],
]

const ColorByTab = [
  'primary.500',
  'yellow.500',
  'green.500',
]

export default function OrderList() {
  const {activeOrder, needToRefresh} = useSelector(state => state.ui)
  const api = useApi()
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders([])
    fetchOrders()
  }, [activeTab])

  useEffect(() => {
    if (needToRefresh) {
      fetchOrders()
    }
  }, [needToRefresh])

  const fetchOrders = () => {
    setLoading(true)
    api.getOrdersApi(StatusByTab[activeTab])
      .then(({data, ok}) => {
        if (ok) {
          // console.log(data)
          setOrders(data?.sort((a, b) => a.updated_at < b.updated_at ? 1 : -1))
          if (data && activeOrder) {
            const updatedActiveOrder = data.find(order => order.id === activeOrder.id)
            dispatch(setActiveOrder(updatedActiveOrder))
          }
          dispatch(setNeedToRefresh(false))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Flex
      flexDirection='column'
      gap={4}
    >
      <Flex
        justifyContent={'space-between'}
      >
        {Tabs.map((tab, id) => {
          const isActive = id === activeTab
          return <Flex key={id}
                       w={'33.3%'}
                       justifyContent={'center'}
                       alignItems={'center'}
                       h={12}
                       bg={isActive ? 'primary.500' : 'white'}
                       color={isActive ? 'white' : 'black'}
                       onClick={() => setActiveTab(id)}
                       cursor={'pointer'}
                       borderWidth={isActive ? 0 : 1}
                       borderColor={'black'}
          >
            {tab}
          </Flex>
        })}
      </Flex>

      <Flex
        direction={'column'}
        gap={4}
        h={{
          base: 140,
          md: 'calc(100vh - 120px)',
        }}
        overflowY={'auto'}
      >
      {loading ?
        new Array(3).fill(0).map((it, id) => <Skeleton h={'80px'} key={id}/>)
      :

       orders.map((order, id) => {
          const totalQuantity = order.dishes?.reduce((acc, item) => acc + item.quantity, 0) || 1
          const isActive = activeOrder && activeOrder.id === order.id

          return <Flex
            key={id}
            justifyContent={'space-between'} h={'80px'}
            alignItems={'center'}
            px={4}
            py={2}
            bg={isActive ? 'gray.100' : 'white'}
            boxShadow={'lg'}
            cursor={'pointer'}
            _hover={{
              bg: 'gray.100',
            }}
            onClick={() => {
              dispatch(setActiveOrder(order))
            }}
          >
            <Flex gap={2}>
              <Avatar src={order.user.customer.photo}/>
              <Flex flexDirection={'column'}>
                <Text>{order.user?.name || '-'}</Text>
                <Text>{totalQuantity} Item{totalQuantity > 1 ? 's' : ''}</Text>
              </Flex>
            </Flex>

            <Flex gap={3}>
              <Flex flexDirection={'column'} alignItems={'flex-end'} justifyContent={'space-between'}>
                <Text color={ColorByTab[activeTab]}>{order.status}</Text>
                <Text color={'gray.500'} fontWeight={'300'}>{moment.utc(order.updated_at).fromNow()}</Text>
              </Flex>
              <Flex justifyContent={'center'} alignItems={'center'}>
                <AiOutlineRight/>
              </Flex>
            </Flex>
          </Flex>
        })
      }
      </Flex>
    </Flex>
  )
}

