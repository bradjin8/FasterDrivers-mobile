import {Box, Checkbox, Divider, Flex, Grid, GridItem, Image, Skeleton, useColorModeValue} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import {useApi} from "../../../services/fasterDriver";

export default function RestaurantList() {
  const {keyword} = useSelector(state => state.ui)

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [restaurantsByCategory, setRestaurantsByCategory] = useState({});
  const api = useApi()
  const history = useHistory()
  const [categoryFilters, setCategoryFilters] = useState([])

  const changeCategoryFilter = (category, checked) => {
    if (checked) {
      setCategoryFilters([...categoryFilters, category])
    } else {
      setCategoryFilters(categoryFilters.filter(cat => cat !== category))
    }
  }
  const fetchRestaurants = () => {
    setLoading(true)
    api.getRestaurantsApi()
      .then(({data, ok}) => {
        // console.log(data)
        if (ok) {
          setRestaurantsByCategory(data)
          setCategories(Object.keys(data).filter(cat => cat !== ''))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const filteredCategories = categoryFilters.length > 0 ? categoryFilters : categories

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Grid
        templateColumns={{md: "1fr", lg: "1fr 3fr"}}
        templateRows={{md: "1fr auto", lg: "1fr"}}
        my='26px'
        gap='24px'>
        <GridItem>
          <Skeleton isLoaded={!loading}>
            <Flex
              direction={'column'}
              p={4} borderRadius={10}
              borderWidth={1}
              borderColor={'gray.200'}
              gap={4}
            >
              <Box>Filter</Box>

              <Flex
                direction={'column'}
                gap={4}
              >    {categories.map((category) => (
                <Checkbox key={'cat-' + category} onChange={(e) => changeCategoryFilter(category, e.target.checked)}>{category}</Checkbox>
              ))}
              </Flex>
            </Flex>
          </Skeleton>
        </GridItem>
        <GridItem>
          <Skeleton isLoaded={!loading}>
            <Flex
              direction={'column'}
              gap={4}
            >
              {filteredCategories.map((category) => {
                let restaurants = restaurantsByCategory[category]
                if (keyword) {
                  restaurants = restaurants.filter(res => res.name.toLowerCase().includes(keyword.toLowerCase()))
                }
                return (
                  <Flex
                    direction={'column'}
                    key={'res-cat-' + category}
                    gap={2}
                  >
                    <Flex>
                      <Box
                        fontSize={16}
                        fontWeight={600}
                      >
                        {category}
                      </Box>
                    </Flex>
                    <Grid
                      templateColumns={{base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)"}}
                      // templateRows={{md: "1fr auto", lg: "1fr"}}
                      gridGap={4}
                    >
                      {restaurants.map((restaurant) => (
                        <GridItem
                          key={'res' + restaurant.id}
                        >
                          <Flex
                            direction={'column'}
                            borderRadius={10}
                            boxShadow={'lg'}
                            cursor={'pointer'}
                            onClick={() => {
                              history.push('/customer/home/' + restaurant.id)
                            }}
                          >
                            <Image
                              src={restaurant.photo} alt={restaurant.name} borderRadius={10} mb={2}
                              h={{
                                base: 'unset',
                                sm: 32,
                                md: 36,
                                xl: 40,
                              }}
                              w={{
                                base: '90%',
                                sm: 'unset',
                              }}
                            />
                            <Box
                              p={2}
                            >
                              <Box>{restaurant.name}</Box>
                              <Box fontSize={12} color={'gray.400'}>{restaurant.description}</Box>
                              <Flex
                                alignItems={'center'}
                                gap={1}
                              >
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
                                <Box fontSize={14} fontWeight={600}>{Number(restaurant.rating).toFixed(1)}</Box>
                              </Flex>
                            </Box>
                          </Flex>
                        </GridItem>
                      ))}
                    </Grid>
                  </Flex>
                )
              })}
            </Flex>
          </Skeleton>
        </GridItem>
      </Grid>
    </Flex>
  );
}
