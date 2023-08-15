import {Flex, Grid, GridItem} from "@chakra-ui/react";
import OrderDetails from "./OrderDetails";
import OrderList from "./OrderList";

export default function RestaurantHome () {
  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Grid
        templateColumns={{md: "1fr", lg: "1fr 1fr"}}
        gridGap={6}
        // bg={'gray.100'}
      >
        <GridItem>
          <OrderList/>
        </GridItem>
        <GridItem>
          <OrderDetails/>
        </GridItem>
      </Grid>
    </Flex>
  )
}
