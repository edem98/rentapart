import React from "react";
import { useState } from "react";
import axios from 'axios';
import { Switch } from "react-native-paper";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "react-native-elements";
import Divider from "./Divider";
import { TouchableOpacity } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import API_CONFIG from "../config/constants";



const screenWidth = Math.round(Dimensions.get("window").width);;

const Property = ({ 
  user,
  property,
  navigation,
  toogleProperty,
  refetch,
}) => {

  const api = axios.create({
    baseURL: `${API_CONFIG.server_url}/api/property/${property.id}/mark-featured`,
    headers: {
      Authorization: `Token ${user.token}`,
    }
  });

  function formatPrice(x) {
    if(x !== null){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  const isBoosted = () => {
    if (property.date_boosted !== null && property.boost_expire !== null) {
      const now = new Date();
      const boostExpire = new Date(property.boost_expiration);
      if (now < boostExpire) {
        return true;
      }
    }
    return false;
  }

  const [isActive, setIsActive] = useState(property.active);

  let payment_uri = `https://paygateglobal.com/v1/page?token=${API_CONFIG.payment_token}&amount=150&description=Property-boost&identifier=alkebulan-${property.id}-${property.boost_count+1}`;
  let check_payment_uri = `https://paygateglobal.com/api/v2/status?auth_token=${API_CONFIG.payment_token}&identifier=alkebulan-${property.id}-1`;
  
  function _onToggleSwitch() {
    toogleProperty(property.id);
  }

  const handleSwitch = () => {
    setIsActive(previous => !previous);
    _onToggleSwitch();
  }

  const markAsFeatured = () => {
    api.patch("/", {
      featured: true,
      boost_count: property.boost_count + 1,
      date_boosted: new Date(),
      boost_expiration: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
    }).then(res => {
      Alert.alert(
        "Succès",
        "La propriété a été mise en avant avec succès",
      )
      refetch()
    }).catch(err => {
      console.log(err.response.data);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise en avant de la propriété",
      )
    })
  };

  const checkPayment = () => {
    axios.post(check_payment_uri).then(res => {
      if (
        res.data.error_message === "Transaction non trouvée."
        && res.data.error_code === 403
      ) {
        Alert.alert(
          "Transaction non trouvée",
          "Vous n'avez pas encore booster cette propriété. Veuillez réessayer.",
          [
            {
              text: "Booster",
              onPress: () => {
                navigation.push('Payment', { uri: payment_uri });
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        if (res.data.status === 0){
          markAsFeatured();
        }
        else if (res.data.status === 2){
          alert("Payement en cours\n Vous receverez sous peu un sms vous invitant à completer le payment");
        }
        else if (res.data.status === 4){
          alert("Payement expiré");
          api.patch("", {
            ...property,
            featured: true,
            boost_count: property.boost_count + 1,
          })
        }
        else {
          alert("Payement annulé");
          api.patch("", {
            ...property,
            featured: true,
            boost_count: property.boost_count + 1,
          })
        }
      }
    }).catch(err => {
      console.log(err);
    })
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
              value={isActive}
              onValueChange={handleSwitch}
              color="#44BBA4"
            />
          </View>
        </Pressable>
        {isBoosted() ? (
        <View
          style={styles.boostZone}>
            <Text style={styles.boostedText}>
              publication boostée
            </Text>
        </View>
        ): (
          <View
            style={styles.boostZone}>  
          <TouchableOpacity
            style={styles.boostZoneItem}
            onPress={() => navigation.push('Payment', { uri: payment_uri })}
          >
            <Text style={styles.boostText}>
              Booster la publication
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={checkPayment}
            style={styles.boostZoneItem}>
            <Text style={styles.boostText}>
              Vérifier le payement
            </Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const mapDispatchToProps = (dispatch) => {
	return {
		signIn: (user) => dispatch(signIn(user)),
	};
};

const mapStateToProps = (state) => {
	return {
		user: state.auth.user,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 20,
    alignSelf: "center",
    alignItems: "center",
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
    flexDirection: screenWidth <= 375 ? "column" : "row",
    flexWrap: screenWidth <= 375 ? "wrap" : "nowrap",
    justifyContent: screenWidth <= 375 ? "center" : "space-around",
    alignItems: screenWidth <= 375 ? "center" : "flex-start",
    width: screenWidth - 10,
    paddingHorizontal: 10,
  },
  boostText: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#5a86d8",
    padding: 8,
    textAlign: "center",
    width: screenWidth <= 375 ? screenWidth - 30 : (screenWidth / 2) - 20,
    marginVertical: screenWidth <= 375 ? 5 : 0,
    height: 40,
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
  },
  boostZoneItem: {
    width: '100%',
  }
});