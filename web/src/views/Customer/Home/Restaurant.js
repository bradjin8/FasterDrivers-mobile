import {Box, Button, Checkbox, Flex, Grid, GridItem, Image, Skeleton} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useHistory} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import {addToCart, removeFromCart, setActiveRestaurant} from "../../../reducers/cart";
import {useApi} from "../../../services/fasterDriver";
import {address2Text, isValidID} from "../../../utils/data";
import help from '../../../assets/svg/help.svg'

export default function Restaurant() {
  const {id} = useParams()
  const {orderMap} = useSelector(state => state.cart)
  const api = useApi()
  const dispatch = useDispatch()
  const {keyword} = useSelector(state => state.ui)

  const [data, setData] = useState({})
  const [categories, setCategories] = useState([])
  const [categoryFilters, setCategoryFilters] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  const Cart = orderMap[id] || {}
  const filteredCategories = categoryFilters.length > 0 ? categoryFilters : categories

  const changeCategoryFilter = (category, checked) => {
    if (checked) {
      setCategoryFilters([...categoryFilters, category])
    } else {
      setCategoryFilters(categoryFilters.filter(cat => cat !== category))
    }
  }

  const atc = (dish) => {
    dispatch(addToCart({restaurantId: id, dishId: dish.id, details: dish}))
  }

  const rfc = (dishId) => {
    dispatch(removeFromCart({restaurantId: id, dishId}))
  }
  const fetchRestaurant = () => {
    setLoading(true)
    api.getRestaurantByIdApi(id)
      .then(({data, ok}) => {
        // console.log('restaurant', data)
        if (ok) {
          dispatch(setActiveRestaurant({
            id: data.id,
            name: data.name,
          }))
          setData(data)
          setCategories(Object.keys(data?.dishes || {}))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const displayReviews = () => {
    if (reviews.length === 0) {
      setReviewLoading(true)
      api.getRestaurantReviewsApi(id)
        .then(({data, ok}) => {
          if (ok) {
            setReviews(data)
          }
        })
        .finally(() => {
          setReviewLoading(false)
        })
    }
    setShowReviews(!showReviews)
  }

  useEffect(() => {
    if (isValidID(id)) {
      fetchRestaurant(id)
    } else {
      // redirect to home page
      // history.replace('/customer/home')
    }
  }, [id])

  const renderCategory = (category) => {
    let dishes = data?.dishes[category] || []
    if (keyword) {
      dishes = dishes.filter(it => it.name.toLowerCase().includes(keyword.toLowerCase()))
    }

    return <Flex
      flexDirection='column' key={'cat-' + category}
      gap={4}
    >
      <Box fontSize={18} fontWeight={500}>{category}</Box>
      <Grid
        templateColumns={{base: "1fr", md: "1fr 1fr"}}
        gridGap={6}
      >
        {dishes.map(it => (
          <GridItem key={'item-' + it.id}>
            <Flex
              justifyContent={'space-between'}
              gap={2}
              // boxShadow={'md'}
              borderRadius={10}
              // p={4}
            >
              <Flex
                direction={'column'}
                justifyContent={'space-between'}
                w={'70%'}
                gap={1}
              >
                <Box fontSize={12}>{it.name}</Box>
                <Box
                  noOfLines={2}
                  fontSize={12} color={'gray.500'}
                  fontWeight={300}
                  textAlign={'justify'}>
                  {it.description}
                </Box>
                <Flex gap={1} alignItems={'center'} fontSize={12}>
                  <Button h={6} fontWeight={400} onClick={() => rfc(it.id)}>-</Button>
                  <Box w={10} textAlign={'center'}>{Cart[it.id]?.quantity || `$${it.price}`}</Box>
                  <Button h={6} fontWeight={400} onClick={() => atc(it)}>+</Button>
                </Flex>
              </Flex>
              <Box
                w={'30%'}
              >
                <Image
                  src={it.image_1 || it.image_2 || it.image_3 || help}
                  alt={it.name}
                  w={'80px'}
                  h={'80px'}
                  // style={{objectFit: 'contain'}}
                  // bg={'gray.500'}
                  // borderRadius={20}
                />
              </Box>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Flex>
  }

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Flex w={'100%'} gap={4} direction={'column'}>
        <Skeleton isLoaded={!loading}>
          <Image src={data?.photo} alt={data?.name} w={'100%'} h={'120px'} style={{objectFit: 'cover'}}/>
        </Skeleton>
        <Flex flexDirection='column' gap={2}>
          <Skeleton isLoaded={!loading}>
            <Flex gap={2} alignItems={'center'}>
              <Flex fontSize={20} fontWeight={500} gap={4}>
                {data?.name} -
              </Flex>
              <Flex fontSize={18} fontWeight={400} color={'gray.500'}>{address2Text(data)}</Flex>
            </Flex>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <Flex fontSize={14} color={'gray.500'}>
              {categories?.join(' - ')}
            </Flex>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <Flex alignItems={'center'} gap={2}>
              <Rating
                size={24}
                iconsCount={1}
                initialValue={data.rating / 5}
                readonly={true}
                SVGstrokeColor={'#0093D9'}
                SVGstorkeWidth={1}
                allowFraction={true}
                fillColor={'#0093D9'}
              />
              <Box fontSize={14} fontWeight={600}>{data?.rating ? Number(data?.rating).toFixed(1) : '-'}</Box>
              <Box fontSize={12} color={'gray.500'}>({data?.rating_count || 0})</Box>
              <Box cursor={'pointer'} onClick={displayReviews}>{showReviews ? 'Hide Reviews':'Show Reviews'}</Box>
            </Flex>
          </Skeleton>
          {showReviews && <Flex flexDirection={'column'} gap={2} pl={4}>
            {
              reviews.map(it => (
                <Flex key={'review-' + it.id} gap={2} alignItems={'center'}>
                  <Rating
                    size={16}
                    initialValue={it.rating}
                    readonly={true}
                    SVGstrokeColor={'#0093D9'}
                    SVGstorkeWidth={1}
                    allowFraction={true}
                    fillColor={'#0093D9'}
                  />
                  <Box fontSize={12} fontWeight={600}>{it?.rating ? Number(it?.rating).toFixed(1) : '-'}</Box>
                  <Box fontSize={12}>{it?.user?.name || ''}</Box>
                  <Box fontSize={12} color={'gray.500'}>"{it.context}"</Box>
                </Flex>
              ))
            }
          </Flex>}
        </Flex>
      </Flex>

      <Grid
        templateColumns={{base: "1fr", sm: "1fr 3fr", lg: "1fr 6fr"}}
        gridGap={7}
      >
        <GridItem>
          <Skeleton isLoaded={!loading}>

            <Flex
              direction={'column'}
              gap={4}
              p={4}
              borderRadius={10}
              borderWidth={1}
              borderColor={'gray.200'}
            >
              {categories.map(it => (<Checkbox key={'filter-cat-' + it} isChecked={categoryFilters.indexOf(it) > -1} onChange={e => changeCategoryFilter(it, e.target.checked)}>
                {it}
              </Checkbox>))}
            </Flex>
          </Skeleton>
        </GridItem>
        <GridItem>
          <Skeleton isLoaded={!loading}>
            <Flex
              direction={'column'}
              gap={4}>
              {filteredCategories.map(it => renderCategory(it))}
            </Flex>
          </Skeleton>
        </GridItem>
      </Grid>
    </Flex>
  )
}
