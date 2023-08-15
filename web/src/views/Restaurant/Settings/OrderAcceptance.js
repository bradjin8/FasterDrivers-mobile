import {Flex, FormControl, FormLabel, Switch} from "@chakra-ui/react";
import SettingsLayout from "../../Common/Settings"

export default function OrderAcceptance () {
  return <SettingsLayout>
    <Flex direction={'column'} w={{base: '90%', md: '50%'}} alignItems={'center'} gap={4}>
      <FormControl display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <FormLabel>Automatically Accept</FormLabel>
        <Switch colorScheme={'primary'} defaultChecked={false}/>
      </FormControl>
    </Flex>
  </SettingsLayout>
}
