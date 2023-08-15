import {Box,} from "@chakra-ui/react";
import React from "react";
import Apps from "./Apps";
// Assets
import Banner from './Banner'
import Categories from "./Categories"
import Cuisines from "./Cuisines";
import Restaurants from "./Restaurants"

function Index() {
  // Chakra color mode

  return (
    <Box
      w='100%'
      mx='auto'
    >
      <Banner/>
      <Categories/>
      <Restaurants/>
      <Cuisines/>
      <Apps/>
    </Box>
  );
}

export default Index;
