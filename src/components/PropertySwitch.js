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
  Linking,
  Pressable,
} from "react-native";
import { Image } from "react-native-elements";
import Divider from "./Divider";
import { TouchableOpacity } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import API_CONFIG from "../config/constants";



const screenWidth = Math.round(Dimensions.get("window").width);;

const Property = ({ property, navigation, toogleProperty }) => {
  function formatPrice(x) {
    if(x !== null){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  let payment_uri = `https://paygateglobal.com/v1/page?token=${API_CONFIG.payment_token}&amount=100&description=Property-boost&identifier=${uuidv4()}`;

  function _onToggleSwitch() {
    toogleProperty(property.id);
  }

  return (
    <TouchableWithoutFeedback>
      <View
        style={styles.container}
      >
        <Pressable onPress={() => null}>
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
          <TouchableWithoutFeedback>
            <Text style={styles.status}>{property.status}</Text>
          </TouchableWithoutFeedback>
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
        </Pressable>
        {property.featured ? (
        <View
          style={styles.boostZone}>
            <Text style={styles.boostedText}>
              publication boostée
            </Text>
        </View>
        ): (
          <TouchableOpacity
          onPress={() => navigation.push('Payment', { uri: payment_uri })}
          style={styles.boostZone}>  
            <Text style={styles.boostText}>
              Booster la publication
            </Text>
        </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 20,
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    marginBottom: 15,
    paddingBottom: 15,
  },
  image: {
    height: 230,
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
    height: 80,
    marginTop: 230,
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
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  propertyFeatures: {
    color: "#000",
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
  },
  priceZone: {
    flexDirection: "row",
    height: 90,
    width: screenWidth - 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginLeft: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a86d8",
    marginTop: 15,
    width: 150,
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
  boostZone: {
    flexDirection: "row",
    justifyContent: "center",
    width: '100%',
  },
  boostText: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#5a86d8",
    padding: 8,
    textAlign: "center",
    width: '95%',
    borderRadius: 30,
  },
  boostedText: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#44BBA4",
    padding: 8,
    textAlign: "center",
    width: '95%',
    borderRadius: 30,
  }
});

export default Property;
