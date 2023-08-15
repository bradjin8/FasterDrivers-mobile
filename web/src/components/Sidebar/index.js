/*eslint-disable*/
// chakra imports
import {
  Box, Button, Flex, useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import {useDispatch} from "react-redux";
import {logout} from "../../reducers/auth";
import {useApi} from "../../services/fasterDriver";
import SidebarContent from "./SidebarContent";

// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";
  const dispatch = useDispatch()

  const {logoText, routes, sidebarVariant} = props;

  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }

  const onLogout = () => {
    dispatch(logout())
  }

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{base: "none", xl: "block"}} position="fixed" borderRightWidth={1}>
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          <Flex
            h={'100%'}
            direction="column"
            justifyContent={'space-between'}
          >
            <SidebarContent routes={routes}
                            logoText={props.logoText}
                            display={props.display}
                            sidebarVariant={sidebarVariant}
            />
            <Button
              bg={'primary.500'}
              color={'white'}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}


export default Sidebar;
