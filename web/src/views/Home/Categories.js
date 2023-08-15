import {Box, Center, Flex, Grid, GridItem, Heading, Text} from "@chakra-ui/react";
import IconAsian from "../../assets/svg/icon-asian.svg";
import IconBakery from "../../assets/svg/icon-bakery.svg";
import IconBurgers from "../../assets/svg/icon-burgers.svg";
import IconPizza from "../../assets/svg/icon-pizza.svg";
import IconSushi from "../../assets/svg/icon-sushi.svg";
import IconWatermelon from "../../assets/svg/icon-watermelon.svg";
import React from "react";

function Categories() {
  return <Flex
    flexDir={'column'}
    py={'20'}
    px={{base: '3%', md: '6%', xl: '10%'}}
    alignItems={'center'}
    w={'100%'}
    justifyContent={'center'}
  >
    <Flex
      color={'white'}
      bg={'primary.500'}
      w={'114px'}
      h={'32px'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'8px'}
    >
      CATEGORIES
    </Flex>
    <Heading as={'h2'} size={'xl'} textAlign={'center'} mt={'10'} mb={'10'}>
      Popular Categories
    </Heading>
    <Grid
      templateColumns={{
        base: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md:'repeat(6, 1fr)'
      }}
      gap={6} w={'100%'}>
      {CATEGORIES.map((category, index) => {
        return <GridItem
          w={'100%'}
          h={'240px'}
          key={index}
          bg={'gray.200'}
          borderRadius={'8px'}
          py={'10'}
        >
          <Flex
            flexDir={'column'}
            alignItems={'center'}
            gap={'4'}
          >
            <Center
              bg={'gray.100'}
              w={'112px'}
              h={'112px'}
              borderRadius={'full'}
            >
              <img src={category.icon} alt={category.name}/>
            </Center>
            <Box textAlign={'center'}>
              <Text>{category.name}</Text>
              <Text color='gray.500' fontSize={'xs'}>From ${category.from}</Text>
            </Box>
          </Flex>
        </GridItem>
      })}
    </Grid>
  </Flex>
}

export default Categories

const CATEGORIES = [
  {
    name: 'Pizza',
    from: 4,
    icon: IconPizza,
  },
  {
    name: 'Sushi',
    from: 4,
    icon: IconSushi,
  },
  {
    name: 'Burgers',
    from: 4,
    icon: IconBurgers,
  },
  {
    name: 'Vegetarian',
    from: 4,
    icon: IconWatermelon,
  },
  {
    name: 'Asian',
    from: 4,
    icon: IconAsian,
  },
  {
    name: 'Bakery',
    from: 4,
    icon: IconBakery,
  }
]
