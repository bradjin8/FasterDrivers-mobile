import {Button, Flex, Image, Text, useToast} from "@chakra-ui/react";
import GoogleMapReact from "google-map-react";
import {useEffect, useState} from "react";
import {IoIosBicycle} from "react-icons/io";
import {RiRestaurantFill} from "react-icons/ri";
import {useSelector} from "react-redux";
import {useApi} from "../../../services/fasterDriver";
import {MAP_API_KEY} from "../../../services/google";
import {extractLatLong, getDistance} from "../../../utils/data";

export default function RestaurantMap() {
  const restaurant = useSelector(state => state.auth.user.restaurant) || {}
  const {activeOrder} = useSelector(state => state.ui) || {}
  const api = useApi()
  const toast = useToast()

  const [resLoc] = useState(extractLatLong(restaurant.location))
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeDriver, setActiveDriver] = useState(null)

  useEffect(() => {
    fetchNearbyDrivers()
  }, [])

  const fetchNearbyDrivers = () => {
    setLoading(true)
    api.getNearbyDriversApi()
      .then(({ok, data}) => {
        if (ok) {
          if (data.length === 0) {
            toast({
              title: 'No available drivers found',
              status: 'warning',
              duration: 2000,
              isClosable: true,
            })
          }

          setDrivers(data.map(driver => {
            const {id, name, driver: {location, phone, photo}} = driver
            const loc = extractLatLong(location)
            return {
              id,
              location: loc,
              distance: getDistance(resLoc, loc),
              name,
              phone,
              photo,
            }
          }))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Flex h={'86vh'} w={'100%'} position={'relative'}>
        {resLoc && <GoogleMapReact
          bootstrapURLKeys={{key: MAP_API_KEY}}
          defaultCenter={{
            lat: resLoc.lat,
            lng: resLoc.lng
          }}
          defaultZoom={14}
        >
          <Flex
            lat={resLoc.lat}
            lng={resLoc.lng}
            bg={'primary.500'}
            borderRadius={'50%'}
            w={'40px'}
            h={'40px'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <RiRestaurantFill size={24} color={'white'}/>
          </Flex>

          {drivers.map((driver, id) => {
            const {id: driverId, name, location, distance} = driver
            const isActive = activeDriver?.id === driverId
            return <Flex
              key={id}
              lat={location.lat}
              lng={location.lng}
              borderRadius={'20px'}
              w={'90px'}
              h={'36px'}
              alignItems={'center'}
              justifyContent={'flex-end'}
              pr={2}
              border={'1px solid'}
              bg={isActive ? 'primary.500' : 'white'}
              borderColor={isActive ? "white" : 'primary.500'}
              cursor={'pointer'}
              onClick={() => setActiveDriver(driver)}
            >
              <Flex
                borderRadius={'20px'}
                w={'36px'}
                h={'36px'}
                alignItems={'center'}
                justifyContent={'center'}
                border={'2px solid'}
                bg={isActive ? 'primary.500' : 'white'}
                borderColor={isActive ? "white" : 'primary.500'}
                position={'absolute'}
                left={0}
              >
                <IoIosBicycle size={24} color={isActive ? 'white' : 'black'}/>
              </Flex>
              <Text fontSize={'xs'} fontWeight={600} color={isActive ? 'white' : 'black'}>{name.split(' ')[0]}</Text>
            </Flex>
          })}
        </GoogleMapReact>}
        {activeDriver && <Flex
          direction={'column'}
          position={'absolute'}
          bottom={10}
          bg={'white'}
          borderRadius={16}
          w={{
            base: '70%',
            md: '40%'
          }}
          left={{
            base: '15%',
            md: '30%'
          }}
          p={3}
          gap={3}
        >
          <Flex justifyContent={'space-between'}>
            <Flex gap={2}>
              <Image src={activeDriver.photo} w={'40px'} h={'40px'} borderRadius={'50%'}/>
              <Flex direction={'column'}>
                <Text fontSize={'xs'} color={'gray.400'}>Courier</Text>
                <Text fontSize={'sm'} fontWeight={400}>{activeDriver.name}</Text>
              </Flex>
            </Flex>
            <Flex direction={'column'} alignItems={'flex-end'} justifyContent={'space-between'}>
              <Text fontSize={'xs'} color={'gray.400'}>Distance</Text>
              <Text fontSize={'xs'} fontWeight={400}>{activeDriver.distance} Miles Away</Text>
            </Flex>
          </Flex>
        </Flex>}
      </Flex>
    </Flex>
  )
}
