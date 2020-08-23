import React from "react";
import { useState } from "react";
import { Switch } from "react-native-paper";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-elements";
import Divider from "./Divider";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const Property = ({ property, navigation, toogleProperty }) => {
  function formatPrice(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function _onToggleSwitch() {
    toogleProperty(property.id);
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("Property", {
          screen: "AddProperty",
          params: { property: property, update: true },
        });
      }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: property.featured_image
              ? property.featured_image
              : "une image",
          }}
          containerStyle={styles.image}
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{
            height: 250,
            width: screenWidth - 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
        <TouchableWithoutFeedback onPress={() => console.log("Status")}>
          <Text style={styles.status}>{property.status}</Text>
        </TouchableWithoutFeedback>
        <View style={styles.featureZone}>
          <Text style={styles.propertyName}>{property.title}</Text>
          <View style={styles.features}>
            <Text style={styles.propertyFeatures}>
              Chambres: {property.bedrooms} -
            </Text>
            <Text style={styles.propertyFeatures}>
              Douches: {property.bathrooms} -
            </Text>
            <Text style={styles.propertyFeatures}>
              Garages: {property.garages}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.priceZone}>
          <Text style={styles.priceText}>
            {formatPrice(property.price)} Francs CFA
          </Text>
          <View
            style={{
              borderRadius: 15,
              borderColor: "#000",
              marginTop: 17,
              backgroundColor: !property.is_active ? "#44BBA4" : "#5a86d8",
              justifyContent: "center",
              alignContent: "center",
              height: 40,
              padding: 5,
              marginRight: -30,
            }}
          >
            <Text style={styles.propertyStatus}>
              {!property.is_active ? "Occupé" : "Libre"}
            </Text>
          </View>
          <Switch
            style={styles.propertySwitch}
            value={!property.is_active}
            onValueChange={_onToggleSwitch}
            color="#44BBA4"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 430,
    width: screenWidth - 20,
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16.0,
    elevation: 24,
  },
  image: {
    height: 250,
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth - 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  statusContainer: {
    borderRadius: 8,
  },
  status: {
    position: "absolute",
    textAlign: "center",
    top: 20,
    left: 15,
    zIndex: 1,
    height: 25,
    width: 95,
    fontSize: 17,
    fontWeight: "bold",
    backgroundColor: "#203260",
    color: "#fff",
    padding: 1,
  },
  featureZone: {
    height: 90,
    marginTop: 250,
    width: screenWidth - 20,
    backgroundColor: "#fff",
  },
  features: {
    flexDirection: "row",
    width: screenWidth - 20,
    alignSelf: "center",
  },
  propertyName: {
    color: "#000",
    fontWeight: "600",
    fontSize: 23,
    marginTop: 15,
    marginLeft: 10,
  },
  propertyFeatures: {
    color: "#000",
    fontSize: 17,
    marginTop: 15,
    marginLeft: 10,
  },
  priceZone: {
    flexDirection: "row",
    height: 90,
    width: screenWidth - 20,
    alignSelf: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginLeft: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5a86d8",
    marginTop: 15,
    width: 150,
  },
  moreInfo: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    marginTop: 17,
    height: 40,
    width: 150,
    padding: 5,
    textAlign: "center",
    backgroundColor: "#ff6363",
  },
  propertySwitch: {
    marginTop: 22,
    marginRight: 10,
    marginLeft: 30,
    padding: 5,
  },
  propertyStatus: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 5,
    width: 100,
  },
});

export default Property;
