/*eslint-disable*/
import {Center, Flex, Grid, GridItem, Image, Input, InputGroup, InputRightElement, Link, List, ListItem, Text} from "@chakra-ui/react";
import IconApplePay from "assets/svg/icon-apple-pay.svg";
import IconFacebook from "assets/svg/icon-facebook.svg";
import IconInstagram from "assets/svg/icon-instagram.svg";
import IconMasterCard from "assets/svg/icon-mastercard.svg";
import IconTelegram from "assets/svg/icon-telegram.svg";
import IconTwitter from "assets/svg/icon-twitter.svg";
import IconVisa from "assets/svg/icon-visa.svg";
import logo from "assets/svg/logo.svg";
import React from "react";
import {NavLink} from "react-router-dom";
import Socials from "../../constants/socials";

export default function Footer(props) {
  // const linkTeal = useColorModeValue("teal.400", "red.200");=
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      w={'100%'}
      bg={'#333333'}
      py={{base: "5%", md: "5%"}}
      px={{base: '3%', md: '6%', xl: '10%'}}
      color={'white'}
      gap={'5'}
    >
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={6}
        w={"100%"}
        pb={'5%'}
      >
        <GridItem>
          <Flex
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"3"}
            w={{
              base: '100%',
              md: '160px'
            }}
          >
            <Image
              src={logo}
              alt={"logo"}
            />
            <Flex
              gap={'4'}
            >
              <a href={Socials.Facebook} target={'_blank'}>
                <Center
                  bg={'primary.500'}
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
                  bg={'primary.500'}
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
                  bg={'primary.500'}
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
        </GridItem>
        <GridItem>
          <Flex
            flexDir={"column"}
            alignItems={{
              base: "center",
              md: "flex-start",
            }}
            gap={"3"}
          >
            <NavLink to={'#'}>
              FAQ
            </NavLink>
            <NavLink to={'#'}>
              About Us
            </NavLink>
            <NavLink to={'#'}>
              Contact Us
            </NavLink>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex
            flexDir={"column"}
            gap={"3"}
          >
            <Text>
              SUBSCRIBE
            </Text>
            <InputGroup>
              <Input
                type={'email'}
                placeholder={'Your email'}
                bg={'white'}
                color={'black'}
                borderRadius={'10px'}
              />
              <InputRightElement>
                <Image
                  src={IconTelegram}
                  alt={'telegram'}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </GridItem>
      </Grid>
      <Flex h={'1px'} bg={'gray.600'}/>
      <Flex
        w={'100%'}
        justifyContent={'space-between'}
        pt={'3%'}
        flexDir={{
          base: "column",
          md: "row",
        }}
        gap={4}
        mb={{base: "20px", xl: "0px"}}
      >
        <Flex
          w={{base: '100%', md: '50%'}}
          gap={'4'}
          justifyContent={{
            base: "center",
            md: 'flex-start',
          }}
          alignItems={'center'}
        >
          <Image
            src={IconVisa}
            alt={'visa'}
            w={'28px'}
            h={'20px'}
          />
          <Image
            src={IconMasterCard}
            alt={'mastercard'}
            w={'28px'}
            h={'20px'}
          />
          <Image
            src={IconApplePay}
            alt={'apple-pay'}
            w={'28px'}
            h={'20px'}
          />
        </Flex>
        <Flex
          w={{
            base: "100%",
            md: '50%'
          }}
          justifyContent={{
            base: "center",
            md: 'flex-end',
          }}
          alignItems={{
            base: "center",
            md: 'center',
          }}
          flexDir={{
            base: "column",
            md: "row",
          }}
        >
          <Link color="gray.200" href="/terms-and-conditions">
            Terms and conditions
          </Link>

          <Link color="gray.200" m={4} href="/privacy-policy">
            Privacy
          </Link>

          <Flex
            color="gray.400"
            alignItems="center"
          >
            &copy; {new Date().getFullYear()} &nbsp;
            <Text>
              Faster Drivers
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
