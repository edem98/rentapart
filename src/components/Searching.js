import React from "react";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/search.gif")}
        width={100}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth - 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
});
