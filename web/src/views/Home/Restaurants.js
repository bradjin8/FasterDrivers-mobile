import {Box, Button, Flex, Grid, GridItem, Heading, Image, Input, InputGroup, InputRightElement, Text} from "@chakra-ui/react";
import HomeBanner2 from "../../assets/img/HomeBanner2.png";
import ImageArchitect1 from "../../assets/img/ImageArchitect1.png";
import ImageArchitect2 from "../../assets/img/ImageArchitect2.png";
import ImageArchitect3 from "../../assets/img/ImageArchitect3.png";
import ImageArchitect4 from "../../assets/img/ImageArchitect4.png";
import PatternRight from "../../assets/svg/home-search-pattern1.svg";
import PatternLeft from "../../assets/svg/home-search-pattern2.svg";
import IconLocation from "../../assets/svg/icon-location.svg";
import IconStar from "../../assets/svg/icon-star.svg";
import React from "react";

function Restaurants() {
  return <Flex
    flexDir={'column'}
    py={'20'}
    px={{base: '3%', md: '6%', xl: '10%'}}
    w={'100%'}
    alignItems={'flex-start'}
    justifyContent={'center'}
    position={'relative'}
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
      RESTAURANTS
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
          Featured Restaurants
        </Heading>
        <Text color='gray.500' fontSize={'xs'}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
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
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      }}
      zIndex={'20'}
      gap={6} w={'100%'}>
      {RESTAURANTS.map((item, index) => {
        return <GridItem key={index}>
          <Flex
            flexDir={'column'}
            gap={'4'}
            borderRadius={'12px'}
            bg={'gray.200'}
            h={'320px'}
            position={'relative'}
          >
            <Image
              src={item.icon}
              alt={item.name}
              borderRadius={'12px 12px 0 0'}
              h={'208px'}
            />
            <Box
              p={'6'}
            >
              <Text>{item.name}</Text>
              <Flex justifyContent={'space-between'}>
                <Text color='gray.500' fontSize={'xs'}>{item.duration}</Text>
                <Text color='gray.500' fontSize={'xs'}>{item.category}</Text>
              </Flex>
            </Box>
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
        src={HomeBanner2}
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
        <Flex
          color={'white'}
          bg={'primary.500'}
          w={'58px'}
          h={'32px'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'8px'}
        >
          MAP
        </Flex>
        <Heading as={'h2'} size={'2xl'}>
          Save money when<br/>
          ordering together!
        </Heading>
        <Text color='gray.500'>
          Our service is designed to save you money when you order together and give you a cash back reward!
        </Text>
        <Flex
          w={'100%'}
          justifyContent={'flex-start'}
          gap={'4'}
        >
          <InputGroup>
            <Input
              borderRadius='12px'
              bg={'white'}
              placeholder={'Your Address...'}
              h={'48px'}
            />
            <InputRightElement
              h={'48px'}
              display={'flex'}
              alignItems={'center'}
            >
              <Image
                src={IconLocation}
                alt={'icon-location'}
                w={'16px'}
              />
            </InputRightElement>
          </InputGroup>
          <Button
            bg={'primary.500'}
            color={'white'}
            h={'44px'}
            w={'170px'}
            borderRadius={'10px'}
            variant={'primary'}
          >
            Search on Map
          </Button>
        </Flex>
      </Flex>
    </Flex>

    <Image
      src={PatternLeft}
      alt={'pattern-left'}
      position={'absolute'}
      bottom={'10'}
      left={'0'}
      />
    <Image
      src={PatternRight}
      alt={'pattern-right'}
      position={'absolute'}
      top={'50%'}
      right={'0'}
      zIndex={'10'}
      />
  </Flex>
}

export default Restaurants

const RESTAURANTS = [
  {
    name: 'Best Burgers',
    icon: ImageArchitect1,
    category: 'Burgers',
    duration: '20-30 min',
    rate: 4.9,
  },
  {
    name: 'Best Pizza',
    icon: ImageArchitect2,
    category: 'Pizza',
    duration: '~45 min',
    rate: 4.3,
  },
  {
    name: 'Sushi',
    icon: ImageArchitect3,
    category: 'Sushi',
    duration: '15-20 min',
    rate: 3.7,
  },
  {
    name: 'Lorem Ipsum',
    icon: ImageArchitect4,
    category: 'Vegetarian',
    duration: '~50 min',
    rate: 4.0,
  },
]
