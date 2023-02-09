import React, { useState } from "react";
import { StyleSheet, View, Switch } from "react-native";
import { color, scaleVertical } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Text } from "../../../components/index";

const OrderAcceptance = ({}) => {
  const [automaticAccept, setAutomaticAccept] = useState(false);
  const [manuallyAccept, setManuallyAccept] = useState(false);
  
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Order Acceptance"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View>
          <View style={styles.listContain}>
            <Text variant="text" color="black" fontSize={16} fontWeight="400">
              Automatically Accept
            </Text>
            <Switch
              value={automaticAccept}
              onChange={() => setAutomaticAccept(!automaticAccept)}
            />
          </View>
          <View style={styles.listContain}>
           <Text variant="text" color="black" fontSize={16} fontWeight="400">
             Manually Accept
           </Text>
           <Switch
             value={manuallyAccept}
             onChange={() => setManuallyAccept(!manuallyAccept)}
           />
         </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  listContain: {
    flexDirection: 'row',
    paddingBottom: scaleVertical(20),
    justifyContent: 'space-between'
  },
})

export default OrderAcceptance;

