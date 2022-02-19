import React from "react";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Dimensions.get("window").width;

export default ({ text, updateData }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.imageStyle} source={require("../../assets/not-found.gif")} />
      <Text style={{ fontSize: 20, marginBottom: screenHeight * 0.2 }}>
        {text}
      </Text>
      <View style={{
          position: 'absolute',
          bottom: 20,
          right: 10,
          padding: 10,
          borderRadius: 50,
          backgroundColor: '#5a86d8',
        }}>
          <Ionicons
            name="arrow-back-outline"
            size={24} color="white"
            onPress={() => updateData()}
          />
      </View>
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
  imageStyle: {
    width: 150,
    height: 150,
  }
});
