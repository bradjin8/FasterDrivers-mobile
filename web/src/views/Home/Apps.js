import {Box, Button, Flex, Heading, Image} from "@chakra-ui/react";
import homeBanner from "../../assets/img/HomeBanner4.png";
import IconApple from "../../assets/svg/icon-apple.svg";
import IconGooglePlay from "../../assets/svg/icon-google-play.svg";
import React from "react";

function Apps () {
  return <Flex
    w="100%"
    h="400px"
    bg={"primary.500"}
    px={{base: '3%', md: '6%', xl: '10%'}}
    flexDir={{base: "column", md: "row"}}
    justifyContent='space-between'
    alignItems='center'
  >
    <Flex
      px={{base: "0px", md: "5%"}}
      flexWrap={'wrap'}
      w={{base: '100%', sm: '50%'}}
      justifyContent={'flex-start'}
      gap={'10'}
    >
      <Heading as={'h2'} color="white" size={'2xl'}>
        Order food in our app is<br/>
        easy, affordable & lucrative.
      </Heading>
      <Flex
        w={'100%'}
        gap={'4'}
      >
        <Button
          bg={'primary.600'}
          color={'white'}
          h={'48px'}
          w={'170px'}
          borderRadius={'10px'}
          variant={'primary'}
        >
          <Image
            src={IconApple}
            alt={'google-play'}
            mr={'2'}
          />
          App Store
        </Button>
        <Button
          bg={'primary.600'}
          color={'white'}
          h={'48px'}
          w={'170px'}
          borderRadius={'10px'}
          variant={'primary'}
        >
          <Image
            src={IconGooglePlay}
            alt={'google-play'}
            mr={'2'}
          />
          Google Play
        </Button>
      </Flex>
    </Flex>

    <Box
      w={{base: '100%', sm: '50%'}}
      h={'400px'}
      position={'relative'}
      overflow={'hidden'}
      pt={'20'}
    >
      <Image
        src={homeBanner}
        alt={'home-banner'}
      />
    </Box>
  </Flex>
}

export default Apps
