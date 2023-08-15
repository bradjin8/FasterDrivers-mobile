import {Flex, Heading, Text} from "@chakra-ui/react";
import {useState} from "react";
import AddPayment from "../../Customer/AddPayment";
import SettingsLayout from "./index";
import Payments from "./Payments";

const MODE = {
  LIST: 0,
  ADD: 1,
}
export default function MyWallet() {
  const [mode, setMode] = useState(MODE.LIST)

  return <SettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '60%'}} alignItems={'center'} gap={4}>
      <Heading fontSize='2xl'>My Wallet</Heading>
      {mode === MODE.LIST && <Payments onAdd={() => setMode(MODE.ADD)}/>}
      {mode === MODE.ADD && <AddPayment onFinished={() => setMode(MODE.LIST)}/>}
    </Flex>
  </SettingsLayout>
}
