// Chakra Icons
import {SearchIcon} from "@chakra-ui/icons";
// Chakra Imports
import {Badge, Button, Flex, IconButton, Input, InputGroup, InputLeftElement, useColorModeValue,} from "@chakra-ui/react";
// Assets
// Custom Icons
import {CartIcon} from "components/Icons/Icons";
// Custom Components
import SidebarResponsive from "components/Sidebar/SidebarResponsive";
import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {USER_TYPES} from "../../constants/users";
import {openCart} from "../../reducers/cart";
import {setKeyword} from "../../reducers/ui";

const getTotalOrderCount = (orderMap) => {
  let res = 0
  Object.keys(orderMap).forEach((restaurantId) => {
    const resCart = orderMap[restaurantId]
    Object.keys(resCart).forEach((dishId) => {
      if (resCart[dishId]?.quantity)
        res += resCart[dishId].quantity
    })
  })
  return res
}
export default function HeaderLinks(props) {
  const {variant, children, fixed, secondary, onOpen, ...rest} = props;

  const {keyword} = useSelector(state => state.ui)
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart)
  const {user} = useSelector(state => state.auth)

  const [orderCount, setOrderCount] = React.useState(getTotalOrderCount(cart.orderMap))

  useEffect(() => {
    setOrderCount(getTotalOrderCount(cart.orderMap))
  }, [cart.lastUpdated])

  // Chakra Color Mode
  let mainTeal = useColorModeValue("#0093D9", "#0093D9");
  let inputBg = useColorModeValue("white", "gray.800");
  let mainText = useColorModeValue("gray.700", "gray.200");

  if (secondary) {
    mainText = "white";
  }
  const settingsRef = React.useRef();
  return (
    <Flex
      pe={{sm: "0px", md: "16px"}}
      w={{sm: "100%", md: "100%"}}
      alignItems="center"
      justifyContent={{
        base: "space-between",
        md: "space-evenly"
      }}
    >
      <InputGroup
        cursor="pointer"
        bg={inputBg}
        borderRadius="15px"
        w={{
          sm: "128px",
          md: "354px",
        }}
        me={{sm: "auto", md: "20px"}}
        _focus={{
          borderColor: {mainTeal},
        }}
        _active={{
          borderColor: {mainTeal},
        }}
        display={{base: 'none', md: 'flex'}}
      >
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<SearchIcon color={'gray.400'} w="24px" h="24px"/>}
            ></IconButton>
          }
        />
        <Input
          fontSize="xs"
          py="15px"
          color={mainText}
          placeholder="Search..."
          borderRadius="inherit"
          value={keyword}
          onChange={(e) => dispatch(setKeyword(e.target.value))}
        />
      </InputGroup>

      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        {...rest}
      />

      {/*<Menu>
        <MenuButton w={'52px'} h={'52px'} borderRadius={'10px'} borderWidth={1}  ml={'10px'}>
          <BellIcon color={'gray.400'} w="23px" h="23px"/>
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>*/}
      {user?.type === USER_TYPES.CUSTOMER && <Button
        variant={'solid'}
        w={'52px'}
        h={'52px'}
        borderRadius={'10px'}
        bg={'#0093D9'}
        ml={'10px'}
        onClick={() => {
          dispatch(openCart())
        }}
      >
        <CartIcon
          ref={settingsRef}
          onClick={props.onOpen}
          color={'white'}
          w="23px" h="23px"
        />
        {orderCount > 0 && <Badge
          position={'absolute'}
          top={0}
          right={0}
          variant={'solid'}
          colorScheme={'red'}
          borderRadius={'50%'}
        >{orderCount}</Badge>}
      </Button>}
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
