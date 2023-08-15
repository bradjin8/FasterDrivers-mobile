import {Box, Button, Center, Flex, Heading, Image, Input} from "@chakra-ui/react";
import React from "react";
import homeBanner from "../../assets/img/HomeBanner1.png";
import homeBannerPattern from "../../assets/svg/home-banner-pattern.svg";
import IconFacebook from "../../assets/svg/icon-facebook.svg";
import IconInstagram from "../../assets/svg/icon-instagram.svg";
import IconTwitter from "../../assets/svg/icon-twitter.svg";
import Socials from "../../constants/socials";

function Banner() {
  return <Box
    w='100%'
    display={'block'}
    h={'100%'}
    overflow={'hidden'}
    position={'relative'}
  >
    <Flex
      w="100%"
      h={{sm: "initial", md: "95vh"}}
      bg={"primary.500"}
      pt={{base: "10%", md: "0%"}}
      px={{base: '3%', md: '6%', xl: '10%'}}
      flexDir={{base: "column", md: "row"}}
      justifyContent='space-between'
      alignItems='center'
      position={'relative'}
    >
      <Flex
        px={{base: "0px", md: "5%"}}
        flexWrap={'wrap'}
        w={{base: '100%', md: '50%'}}
        justifyContent={'flex-start'}
        alignItems={'space-between'}
        gap={{
          base: '10',
          md: '160'
        }}
        zIndex={'100'}
      >
        <Flex
          flexDir={'column'}
          gap={'10'}
        >
          <Heading as={'h2'} color="white" size={'2xl'}>
            Lower Costs,<br/>
            Higher Earnings<br/>
            For All
          </Heading>
          <Box
            w={'100%'}
            pos={'relative'}
          >
            <Input
              borderRadius='12px'
              bg={'white'}
              placeholder={'Search...'}
              h={'48px'}
            />
            <Button
              bg={'primary.500'}
              color={'white'}
              h={'44px'}
              w={'116px'}
              borderRadius={'10px'}
              variant={'primary'}
              position={'absolute'}
              right={'2px'}
              top={'2px'}
              zIndex={'10'}
            >
              Search
            </Button>
          </Box>
        </Flex>
        <Flex
          gap={'4'}
        >
          <a href={Socials.Facebook} target={'_blank'}>
            <Center
              bg={'primary.600'}
              w={'48px'}
              h={'48px'}
              borderRadius={'50%'}
            >
              <Image
                src={IconFacebook}
                alt={'facebook'}
              />
            </Center>
          </a>
          <a href={'#'}>
            <Center
              bg={'primary.600'}
              w={'48px'}
              h={'48px'}
              borderRadius={'50%'}
            >
              <Image
                src={IconTwitter}
                alt={'twitter'}
              />
            </Center>
          </a>
          <a href={Socials.Instagram} target={'_blank'}>
            <Center
              bg={'primary.600'}
              w={'48px'}
              h={'48px'}
              borderRadius={'50%'}
            >
              <Image
                src={IconInstagram}
                alt={'instagram'}
              />
            </Center>
          </a>
        </Flex>
      </Flex>

      <Image
        src={homeBanner}
        w={{base: '100%', md: '50%'}}
        zIndex={'20'}
      />
    </Flex>

    <Box
      pos={'absolute'}
      right={'0'}
      top={'8%'}
      h={'120%'}
    >
      <Image
        src={homeBannerPattern}
        h={'100%'}
        fit={'cover'}
        objectPosition={'right'}
      />
    </Box>
  </Box>
}

export default Banner
