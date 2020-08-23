import React from "react";
import { View, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default () => {
  return (
    <View
      style={{
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        marginTop: -5,
        alignSelf: "center",
        width: screenWidth - 25,
      }}
    />
  );
};
