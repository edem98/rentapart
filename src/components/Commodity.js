import React from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default ({ name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.li}></View>
      <Text style={styles.featureName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 20,
    marginRight: 20,
  },
  li: {
    backgroundColor: "red",
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  featureName: {
    fontSize: 16,
    marginLeft: 8,
    marginTop: -5,
  },
});
