import React, { useState } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const screenWidth = Math.round(Dimensions.get("window").width);

export default ({ updateImage, imageType, defaultImage }) => {
  const [image, setImage] = useState({
    uri: defaultImage,
  });

  async function getPermissionAsync() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Désolé, nous avons besoin des accès à la caméra!");
      }
    }
  }

  async function _pickImage() {
    getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result);
        updateImage(imageType, result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.uri }}
        style={{ width: screenWidth - 50, height: 180, borderRadius: 10 }}
      />
      <TouchableOpacity style={styles.pickImage} onPress={_pickImage}>
        <AntDesign
          name="camerao"
          size={30}
          color="white"
          style={{ marginTop: 3, marginLeft: 3 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    width: screenWidth - 50,
    borderRadius: 40,
    marginBottom: 20,
  },
  pickImage: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#5a86d8",
    zIndex: 1000,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
});
