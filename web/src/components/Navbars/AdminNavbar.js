// Chakra Imports
import {Avatar, Box, Flex, FormControl, FormLabel, Link, Menu, MenuButton, MenuItem, MenuList, Select, useColorModeValue, useToast,} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {GrFormLocation} from "react-icons/gr";
import {useDispatch, useSelector} from "react-redux";
import {USER_TYPES} from "../../constants/users";
import {setDeliveryAddress} from "../../reducers/cart";
import {getAddressFromLocation} from "../../services/google";
import {address2Text} from "../../utils/data";
import AdminNavbarLinks from "./AdminNavbarLinks";

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const {
    variant,
    children,
    fixed,
    onOpen,
    ...rest
  } = props;

  const {user} = useSelector(state => state.auth)
  const profile = user[user?.type?.toLowerCase()] || {}
  // console.log('profile', profile)

  const {deliveryAddress} = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const toast = useToast()

  const [currentAddress, setCurrentAddress] = useState(null)

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("#0093D9", "gray.200");
  let secondaryText = useColorModeValue("gray.400", "gray.200");
  let navbarPosition = "absolute";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(21px)";
  let navbarShadow = "none";
  let navbarBg = "none";
  let navbarBorder = "gray.200";
  let secondaryMargin = "0px";
  let paddingX = "15px";
  if (props.fixed === true)
    if (scrolled === true) {
      navbarPosition = "fixed";
      navbarShadow = useColorModeValue(
        "0px 7px 23px rgba(0, 0, 0, 0.05)",
        "none"
      );
      navbarBg = useColorModeValue(
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
      );
      navbarBorder = useColorModeValue("#FFFFFF", "rgba(255, 255, 255, 0.31)");
      navbarFilter = useColorModeValue(
        "none",
        "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
      );
    }
  if (props.secondary) {
    navbarBackdrop = "none";
    navbarPosition = "absolute";
    mainText = "white";
    secondaryText = "white";
    secondaryMargin = "22px";
    paddingX = "30px";
  }
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  window.addEventListener("scroll", changeNavbar);
  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderBottomWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={"center"}
      minH="75px"
      justifyContent={{xl: "center"}}
      lineHeight="25.6px"
      mt={secondaryMargin}
      pb="8px"
      // left={0}
      right={0}
      px={30}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top="18px"
      w={{base: "calc(100vw)", xl: "calc(100vw - 300px)"}}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{xl: "center"}}
        gap={4}
      >
        <Flex
          mb={{sm: "8px", md: "0px"}} gap={2}
          w={{sm: "100%", md: "50%"}}
          alignItems={'center'}
        >
          <Link
            href="#"
            bg="inherit"
            borderRadius="inherit"
            _hover={{color: {mainText}}}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            w={{sm: "100%", md: "60%"}}
            ml={4}
          >
            <Flex
              alignItems="center"
              gap={2}
            >
              <Avatar
                w={8}
                h={8}
                name={user?.name}
                src={profile?.photo}
                bg={'gray.200'}
              />
              <Box
                display={{base: 'none', md: 'block'}}
                fontSize={14}>{user?.name}</Box>
            </Flex>
          </Link>
          {user?.type === USER_TYPES.CUSTOMER && <FormControl>
            <FormLabel fontSize={12} color={'primary.500'}>
              DELIVER TO
            </FormLabel>
            <Menu>
              <MenuButton fontSize={12}>
                {address2Text(deliveryAddress) || 'Choose Address'}
              </MenuButton>
              <MenuList>
                {profile?.addresses?.map((it) => <MenuItem
                  key={it.id} value={it.id}
                  onClick={() => dispatch(setDeliveryAddress(it))}
                >
                  {address2Text(it)}
                </MenuItem>)}
                {
                  currentAddress === null ? <MenuItem
                    onClick={() => {
                      //TODO: get current location
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          const {latitude, longitude} = position.coords
                          getAddressFromLocation({latitude, longitude})
                            .then(address => {
                              console.log(address)
                              if (address) {
                                setCurrentAddress(address)
                                dispatch(setDeliveryAddress(address))
                              } else {
                                toast({
                                  title: 'Error',
                                  description: 'Unable to get address from location',
                                })
                              }
                            })
                            .catch(err => {
                              toast({
                                title: 'Error',
                                description: err.message,
                              })
                            })
                        })
                      }
                    }}
                  >
                    <GrFormLocation size={26} color={'gray.400'}/>
                    Current Location
                  </MenuItem> : <MenuItem
                    onClick={() => dispatch(setDeliveryAddress(currentAddress))}
                  >
                    {address2Text(currentAddress)}
                  </MenuItem>
                }
              </MenuList>
            </Menu>

          </FormControl>}
        </Flex>
        <Flex ms="auto" w={{sm: "100%", md: "50%"}} alignItems={'center'}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
