import {Flex, Grid, GridItem} from "@chakra-ui/react";
import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {USER_TYPES} from "../../../constants/users";
import {customerSettingsRoutes} from "../../Customer/Settings";
import {restaurantSettingsRoutes} from "../../Restaurant/Settings";

export default function SettingsLayout({children}) {
  const location = useLocation()
  const history = useHistory()
  const {user} = useSelector(state => state.auth)
  const routes = user?.type === USER_TYPES.RESTAURANT ? restaurantSettingsRoutes : customerSettingsRoutes

  return <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
    <Grid
      templateColumns={{md: "1fr", lg: "1fr 3fr"}}
      templateRows={{md: "1fr auto", lg: "1fr"}}
      my='26px'
      gap='24px'>
      <GridItem>
        <Flex direction={'column'} gap={4} pr={8} h={{base: 140, md: 'unset'}} overflowY={'auto'}>
          {routes.map((route, key) => {
            return (
              <Flex
                key={key}
                bg={location.pathname === `${route.path}` ? 'blue.100' : 'transparent'}
                p={2}
                px={4}
                borderRadius={10}
                cursor={'pointer'}
                onClick={() => {
                  history.push(`${route.path}`)
                }}
                alignItems={'center'}
                gap={4}
              >
                {route.icon && route.icon}
                {route.name}
              </Flex>
            )
          })}
        </Flex>
      </GridItem>
      <GridItem>
        {children}
      </GridItem>
    </Grid>
  </Flex>
}
