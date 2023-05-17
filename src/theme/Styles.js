import {StyleSheet} from "react-native";
import {scale, scaleVertical, color} from "../utils";

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

export const Margin = StyleSheet.create({
  v5: {
    marginVertical: scaleVertical(5),
  },
  v10: {
    marginVertical: scaleVertical(10),
  },
  h5: {
    marginHorizontal: scale(5)
  },
  h10: {
    marginHorizontal: scale(10)
  },
  b10: {
    marginBottom: scaleVertical(10)
  },
  b5: {
    marginBottom: scaleVertical(5)
  },
  t10: {
    marginTop: scaleVertical(10)
  },
  t5: {
    marginTop: scaleVertical(5)
  },
})

export const Padding = StyleSheet.create({
  v5: {
    paddingVertical: scaleVertical(5),
  },
  v10: {
    paddingVertical: scaleVertical(10),
  },
  h5: {
    paddingHorizontal: scale(5)
  },
  h10: {
    paddingHorizontal: scale(10)
  },
  t5: {
    paddingTop: scaleVertical(5)
  },
  t10: {
    paddingTop: scaleVertical(10)
  },
  b5: {
    paddingBottom: scaleVertical(5)
  },
  b10: {
    paddingBottom: scaleVertical(10)
  },
})

export const Border = StyleSheet.create({
  black: {
    borderColor: color.black,
  },
  w2: {
    borderWidth: 2,
  },
  round20: {
    borderRadius: 20,
  },
  round10: {
    borderRadius: 10,
  },
  primary: {
    borderColor: color.primary,
  },
})

export const BG = StyleSheet.create({
  primary: {
    backgroundColor: color.primary
  },
  secondary: {
    backgroundColor: color.secondary,
  }
})
