import {Avatar, Flex, Image, Skeleton, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useAdminApi} from "../../../services/fasterDriver";
import moment from "moment";

export default function FeedbackList({activeItem, setActiveItem}) {
  const api = useAdminApi()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = () => {
    setLoading(true)
    api.getFeedbacks()
      .then(({data, ok}) => {
        if (ok) {
          setData(data.sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix()))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Flex
      flexDirection='column'
      gap={2}
      p={2}
      bg={'white'}
    >
      <Flex
        direction={'column'}
        gap={3}
        h={{
          base: 140,
          md: 'calc(90vh - 126px)',
        }}
        overflowY={'auto'}
      >
        {loading ?
          new Array(3).fill(0).map((it, id) => <Skeleton h={'80px'} key={id}/>)
          :
          data.map((item, id) => {
            const isActive = activeItem && activeItem.id === item.id
            return <Flex
              key={id}
              justifyContent={'space-between'} h={'80px'}
              alignItems={'center'}
              px={4}
              bg={isActive ? 'primary.500' : 'white'}
              cursor={'pointer'}
              _hover={{
                bg: 'primary.600',
              }}
              onClick={() => setActiveItem(item)}
              borderRadius={10}
              boxShadow={'lg'}
            >
              <Flex gap={2} w={'60%'}>
                <Avatar src={item.user?.[item.user?.type?.toLowerCase()]?.photo} h={'60px'} w={'60px'}/>
                <Flex flexDirection={'column'} w={'80%'} justifyContent={'space-between'}>
                  <Text color={isActive ? 'white' : 'inherit'}>{item.user?.name}</Text>
                  <Text color={isActive ? 'white' : 'inherit'} fontSize={16} fontWeight={'bold'} noOfLines={1} textAlign={'justify'}>{item.subject}</Text>
                </Flex>
              </Flex>

              <Flex flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-start'}>
                <Text color={isActive ? 'white' : 'inherit'}>{moment.utc(item.updated_at).format('hh:mm A')}</Text>
                <Text color={'gray.400'}>{item.responded ? 'Replied' : ''}</Text>
              </Flex>
            </Flex>
          })
        }
      </Flex>
    </Flex>
  )
}

