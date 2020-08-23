import React from "react";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default ({ text }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/loading.gif")} resizeMode="center" />
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
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
});
