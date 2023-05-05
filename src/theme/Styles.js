import {StyleSheet} from "react-native";

export const Flex = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyEvenly: {
    justifyContent: "space-evenly",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  itemsEnd: {
    alignItems: "flex-end",
  },
  itemsCenter: {
    alignItems: "center",
  },
  stretch: {
    alignItems: "stretch",
  },
  baseline: {
    alignItems: "baseline",
  },
  wrap: {
    flexWrap: "wrap",
  },
  wrapReverse: {
    flexWrap: "wrap-reverse",
  },
  nowrap: {
    flexWrap: "nowrap",
  },
  flex1: {
    flex: 1,
  },
})
