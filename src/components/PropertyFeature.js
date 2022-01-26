import React from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";

const screenWidth = Math.round(Dimensions.get("window").width);

export default ({ name, value }) => {
  let iconame = "ios-home";
  let itype = "ionicon";
  let isize = 40;
  switch (name) {
    case "Garages - ":
      iconame = "warehouse";
      itype = "FontAwesome 5";
      isize = 30;
      break;
    case "Douches - ":
      iconame = "bath";
      itype = "FontAwesome 5";
      break;
    case "Ménages - ":
      iconame = "group";
      itype = "FontAwesome";
      isize = 40;
      break;
    case "Chambres - ":
      iconame = "ios-bed";
      break;
    default:
      iconame = "ios-home";
      itype = "ionicon";
  }
  if (itype == "ionicon") {
    return (
      <View style={styles.container}>
        <Ionicons name={iconame} type={itype} size={isize} color="#ff6363" />
        <Text style={styles.feature}>
          {name} {value}
        </Text>
      </View>
    );
  } else if (itype == "MaterialCommunityIcons") {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name={iconame}
          type={itype}
          size={40}
          color="#ff6363"
        />
        <Text style={styles.feature}>
          {name} {value}
        </Text>
      </View>
    );
  } else if (itype == "FontAwesome 5") {
    return (
      <View style={styles.container}>
        <FontAwesome5
          name={iconame}
          type={itype}
          size={isize}
          color="#ff6363"
        />
        <Text style={styles.feature}>
          {name} {value}
        </Text>
      </View>
    );
  } else if (itype == "FontAwesome") {
    return (
      <View style={styles.container}>
        <FontAwesome name={iconame} type={itype} size={isize} color="#ff6363" />
        <Text style={styles.feature}>
          {name} {value}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    width: screenWidth - 20,
    marginTop: 10,
  },
  feature: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    padding: 5,
    marginLeft: 10,
  },
});
