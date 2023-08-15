import {Button, Flex, Image, Skeleton, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setActiveDish} from "../../../reducers/ui";
import {useApi} from "../../../services/fasterDriver";

export default function DishList({onAddNew}) {
  const {activeDish, needToRefreshDishes} = useSelector(state => state.ui)
  const api = useApi()
  const dispatch = useDispatch()
  const {user: {restaurant}} = useSelector(state => state.auth)

  const [loading, setLoading] = useState(false)
  const dishes = [...restaurant?.dishes] || []

  useEffect(() => {
    if (needToRefreshDishes) {
      fetchDishes()
    }
  }, [needToRefreshDishes])

  useEffect(() => {
    fetchDishes()
  }, [])
  const fetchDishes = () => {
    setLoading(true)
    api.fetchUserApi()
      .then(({data, ok}) => {
        if (ok) {
          if (activeDish) {
            const dish = data.restaurant.dishes.find(dish => dish.id === activeDish.id)
            dispatch(setActiveDish(dish))
          }
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
      boxShadow={'lg'}
    >
      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        p={4}
      >
        <Text fontSize={'lg'} fontWeight={'bold'}>Dishes</Text>
        <Button colorScheme={'primary'} borderRadius={20} fontSize={14} onClick={onAddNew}>Add New</Button>
      </Flex>
      <Flex
        direction={'column'}
        gap={2}
        h={{
          base: 140,
          md: 'calc(90vh - 126px)',
        }}
        overflowY={'auto'}
      >
        {loading ?
          new Array(3).fill(0).map((it, id) => <Skeleton h={'80px'} key={id}/>)
          :
          dishes?.sort((a, b) => a.updated_at > b.updated_at ? -1 : 1)?.map((dish, id) => {
            const isActive = activeDish && activeDish.id === dish.id
            return <Flex
              key={id}
              justifyContent={'space-between'} h={'80px'}
              alignItems={'center'}
              px={4}
              bg={isActive ? 'gray.100' : 'white'}
              cursor={'pointer'}
              _hover={{
                bg: 'gray.100',
              }}
              onClick={() => {
                dispatch(setActiveDish(dish))
              }}
            >
              <Flex gap={2} w={'80%'}>
                <Image src={dish.image_1} h={'60px'} w={'60px'}/>
                <Flex flexDirection={'column'} w={'80%'}>
                  <Text>{dish.name || '-'}</Text>
                  <Text fontSize={12} noOfLines={2} textAlign={'justify'}>{dish.description}</Text>
                </Flex>
              </Flex>

              <Flex gap={3}>
                <Flex flexDirection={'column'} alignItems={'flex-end'} justifyContent={'space-between'}>
                  <Text>${dish.price}</Text>
                </Flex>
              </Flex>
            </Flex>
          })
        }
      </Flex>
    </Flex>
  )
}

