import React from "react";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Dimensions.get("window").width;

export default ({ text }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/not-found.gif")} />
      <Text style={{ fontSize: 20, marginBottom: screenHeight * 0.2 }}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
});
