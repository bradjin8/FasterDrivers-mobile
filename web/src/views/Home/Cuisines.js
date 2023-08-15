import {Box, Button, Flex, Grid, GridItem, Heading, Image, Text} from "@chakra-ui/react";
import {useHistory} from "react-router-dom";
import HomeBanner3 from "../../assets/img/HomeBanner3.png";
import ImageAsian from "../../assets/img/ImageAsian.png";
import ImageBakery from "../../assets/img/ImageBakery.png";
import ImageBurgers from "../../assets/img/ImageBurgers.png";
import ImagePizza from "../../assets/img/ImagePizza.png";
import ImagePizza2 from "../../assets/img/ImagePizza2.png";
import ImageSushi from "../../assets/img/ImageSushi.png";
import PatternLeft from "../../assets/svg/home-submit-pattern1.svg";
import PatternRight from "../../assets/svg/home-submit-pattern2.svg";
import IconStar from "../../assets/svg/icon-star.svg";
import React from "react";

function Cuisines() {
  const history = useHistory()

  const onSubmit = (e) => {
    history.push('/signup?userType=Restaurant')
  }

  return <Box
    display={'block'}
    h={{
      base: 'unset',
      md: '180vh'
    }}
    py={'20'}
    px={{base: '3%', md: '6%', xl: '10%'}}
    w={'100%'}
    position={'relative'}
    overflowY="hidden"
  >
    <Flex
      color={'white'}
      bg={'primary.500'}
      w={'140px'}
      h={'32px'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'8px'}
    >
      CUISINES
    </Flex>
    <Flex
      w={'100%'}
      justifyContent={'space-between'}
      alignItems={'center'}
      my={'5'}
    >
      <Flex
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        gap={'3'}
      >
        <Heading as={'h2'} size={'xl'} textAlign={'center'}>
          Cuisines
        </Heading>
        <Text color='gray.500' fontSize={'xs'}>
          Best cuisines for customers in your area
        </Text>
      </Flex>
      <Flex
        w={'30%'}
        justifyContent={'flex-end'}
        alignItems={'center'}
      >
        <Text>View All</Text>
      </Flex>
    </Flex>
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        lg: 'repeat(2, 1fr)',
      }}
      gap={6} w={'100%'}>
      {CUISINES.map((item, index) => {
        return <GridItem key={index}>
          <Flex
            flexDir={{
              base: 'column',
              md: 'row',
            }}
            gap={'4'}
            borderRadius={'12px'}
            bg={'gray.200'}
            h={{
              base: 'unset',
              md: '208px'
            }}
            position={'relative'}
          >
            <Image
              src={item.icon}
              alt={item.name}
              w={{
                base: 'unset',
                md: '270px'
              }}
            />
            <Flex
              flexDir={'column'}
              justifyContent={'space-between'}
              p={'6'}
              w={'100%'}
            >
              <Text color='gray.500' fontSize={'md'}>{item.category}</Text>
              <Text fontSize={'2xl'} fontWeight={'600'}>{item.name}</Text>
              <Text fontSize={'sm'} color={'gray.400'}>{item.address}</Text>
              <Flex justifyContent={'space-between'} mt={'16px'} aria-label={'center'}>
                <Text color='gray.700' fontSize={'md'}>{item.duration}</Text>
                <Text color={'gray.400'}>From ${item.cost}</Text>
              </Flex>
            </Flex>
            <Flex
              position={'absolute'}
              w={'92px'}
              h={'48px'}
              bg={'primary.500'}
              gap={2}
              borderRadius={'8px'}
              top={'16px'}
              left={'16px'}
              zIndex={'10'}
              alignItems={'center'}
              px={'2'}
            >
              <Image
                src={IconStar}
                alt={'icon-star'}
              />
              <Text color={'white'} fontSize={'20px'}>{item.rate?.toFixed(1)}</Text>
            </Flex>
          </Flex>
        </GridItem>
      })}
    </Grid>
    <Flex
      w="100%"
      h={{sm: "initial", md: "70vh"}}
      pt={{base: "30%", md: "10%"}}
      flexDir={{base: "column", md: "row"}}
      justifyContent='space-between'
      alignItems='center'
      position={'relative'}
      gap={'2'}
    >
      <Image
        src={HomeBanner3}
        w={{base: '100%', md: '50%'}}
        zIndex={'20'}
      />
      <Flex
        px={{base: "0px", md: "5%"}}
        flexWrap={'wrap'}
        w={{base: '100%', md: '50%'}}
        justifyContent={'flex-start'}
        gap={'10'}
        zIndex={'100'}
        flexDir={'column'}
      >
        <Heading as={'h2'} size={'2xl'}>
          Add Your restaurant<br/>
          to our platform!
        </Heading>
        <Text color='gray.500'>
          Lower your delivery costs when you add your menu to our platform!
        </Text>
        <Flex
          w={'100%'}
          justifyContent={'flex-start'}
          gap={'4'}
        >
          <Button
            bg={'primary.500'}
            color={'white'}
            h={'44px'}
            w={'170px'}
            borderRadius={'10px'}
            variant={'primary'}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </Flex>
    <Image
      src={PatternLeft}
      alt={'pattern-left'}
      position={'absolute'}
      left={'0'}
      bottom={'-10%'}
    />
    <Image
      src={PatternRight}
      alt={'pattern-right'}
      position={'absolute'}
      top={'70%'}
      right={'0'}
    />
  </Box>
}

export default Cuisines

const CUISINES = [
  {
    name: 'Best Burgers',
    icon: ImageBurgers,
    category: 'Burgers',
    address: '2715 Ash Dr, San Jose, CA 95111',
    duration: '20-30 min',
    rate: 4.9,
    cost: 4,
  },
  {
    name: 'Best Pizza',
    icon: ImagePizza,
    category: 'Pizza',
    address: '3891 Ranchview Dr, Richardson, TX 75082',
    duration: '~45 min',
    rate: 4.9,
    cost: 4,
  },
  {
    name: 'Asian',
    icon: ImageAsian,
    category: 'Asian',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    duration: '15-20 min',
    rate: 4.5,
    cost: 4,
  },
  {
    name: 'Sushi',
    icon: ImageSushi,
    category: 'Sushi',
    address: '4140 Parker Rd. Allentown, New Mexico 31134',
    duration: '30-40 min',
    rate: 4.7,
    cost: 4,
  },
  {
    name: 'Bakery',
    icon: ImageBakery,
    category: 'Bakery',
    address: '4140 Parker Rd. Allentown, New Mexico 31134',
    duration: '~20 min',
    rate: 4.8,
    cost: 4,
  },
  {
    name: 'Second Pizza',
    icon: ImagePizza2,
    category: 'Pizza',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    duration: '~45 min',
    rate: 4.3,
    cost: 4,
  },
]
