// Chakra imports
import {Button, Flex, HStack, Image, Text, useColorModeValue,} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import {NavLink} from "react-router-dom";
import homeLogoPattern from "../../assets/svg/home-logo-pattern.svg";
import logo from "../../assets/svg/logo.svg";
import {useScrollPosition} from "../../utils/hooks";
import cart from "../../assets/svg/cart.svg";

export default function AuthNavbar(props) {
  const scrollPosition = useScrollPosition()
  const isLanding = props.path === '/';
  const hideBg = props.path === '/signin' || props.path === '/signup';
  const shouldFixed = scrollPosition > 200 || hideBg;
  const navbarPosition = shouldFixed ? "fixed" : "relative";
  const hideSignIn = props.path === '/signin';
  const hideSignUp = props.path === '/signup';

  const linksAuth = (
    <HStack
      display={"flex"}
    >
      <NavLink to="/signin">
        <Button
          fontSize="sm"
          w={{base: "80px", sm: "100px", md: "170px"}}
          h="48px"
          me={{sm: "2px", md: "16px"}}
          color={'white'}
          bg={"#00AEEF"}
          variant="primary"
          display={hideSignIn ? 'none' : 'block'}
        >
          <Text>Log In</Text>
        </Button>
      </NavLink>
      <NavLink to="/signup">
        <Button
          fontSize="sm"
          w={{base: "80px", sm: "100px", md: "170px"}}
          h="48px"
          me={{sm: "2px", md: "16px"}}
          color={'white'}
          bg={'primary.500'}
          _hover={{bg: 'white', color: 'primary.500'}}
          variant="outline"
          borderColor={'primary.600'}
          display={hideSignUp ? 'none' : 'block'}
        >
          <Text>Sign Up</Text>
        </Button>
      </NavLink>
      <NavLink to={'/cart'}>
        <Button
          fontSize="sm"
          w={'48px'}
          h="48px"
          me={{sm: "2px", md: "16px"}}
          color={'white'}
          bg={'primary.600'}
          borderRadius={'full'}
          variant={'ghost'}
        >
          <Image src={cart}/>
        </Button>
      </NavLink>
    </HStack>
  );
  return (
    <Flex
      w={'100%'}
      position={navbarPosition}
      top="0px"
      pr={{base: "2%", md: "10%"}}
      py={isLanding || hideBg ? '10px': '0px'}
      mx="auto"
      justifyContent={'space-between'}
      alignItems="center"
      zIndex={700}
      bg={hideBg === true ? 'transparent' : 'primary.500'}
      // transition={'all .8s ease'}
      boxShadow={!hideBg && shouldFixed ? '2xl' : 'none'}
    >
      {isLanding && <Image
        position={'absolute'}
        top='0'
        left='0'
        src={homeLogoPattern}
        w={{base: "50vw", sm: "45vw", md: "auto"}}
        zIndex={'910'}
        alt='Faster Drivers'
        display={hideBg === true ? 'none' : 'block'}
      />}
      <NavLink to={'/'}>
        <Flex
          position={isLanding ? 'absolute': 'relative'}
          top={isLanding ? {base: '10px', sm: '15px', md: '25px'} : 'unset'}
          left={isLanding ? {base: '5px', sm: '20px', md: '34px'} : 'unset'}
          bg={isLanding ? 'transparent' : 'rgba(255, 255, 255, 0.9)'}
          zIndex={'920'}
          display={hideBg === true ? 'none' : 'block'}
          px={isLanding ? 'unset' : {base: '5px', sm: '12px', md: '24px'}}
          py={isLanding ? 'unset' : {base: '5px', sm: '8px', md: '10px'}}
        >
          <Image
            src={logo}
            alt='Faster Drivers'
            h={isLanding ? {base: "50px", sm: '60px', md: "78px"} : {base: "40px", sm: '44px', md: "50px"}}
          />
        </Flex>
      </NavLink>
      <Flex
        w="100%" justifyContent={"flex-end"}
        alignItems={"center"}
      >
        {linksAuth}
      </Flex>
    </Flex>
  );
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
};
