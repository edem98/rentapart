import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { Image, CheckBox, Rating } from "react-native-elements";
import Divider from "./Divider";

const screenWidth = Math.round(Dimensions.get("window").width);
// const screenHeight = Math.round(Dimensions.get("window").height);

const VisitScheduled = ({
  propertyId,
  token,
  visit,
  navigation,
  setVisited,
  scheduled,
  userType,
  visitclient,
}) => {
  const [property, setProperty] = useState({});
  const [agent, setAgent] = useState({});
  const [client, setClient] = useState({});

  useEffect(() => {
    getProperty(propertyId);
  }, []);

  async function getProperty(propertyid) {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/property/${propertyid}/`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request and get back the property
    let property = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data);
      });
    if (property) {
      if (userType == "agent") {
        extractClient(visitclient);
      } else if (userType == "client") {
        extractAgent(property.agent);
      }
      setProperty(property);
    } else {
      return undefined;
    }
  }

  async function extractClient(clientId) {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/operations/client/account-id/${clientId}`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request and get back the agent in charge of the property
    let myClient = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        //console.log(error);
      });
    if (myClient) {
      setClient(myClient);
    } else {
      return undefined;
    }
  }

  async function extractAgent(id) {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/operations/agent/account-id/${id}`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request and get back the agent in charge of the property
    let agent = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        //console.log(error);
      });
    if (agent) {
      setAgent(agent);
    } else {
      return undefined;
    }
  }

  async function rateVisite(rate, id) {
    console.log(id);
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/operations/client-rate-visit/${id}/`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request and get back the agent in charge of the property
    await api
      .put(`/`, { rate: rate })
      .then((res) =>
        Alert.alert("SUCCÈS!!", res.data["response"], [
          {
            text: "Fermer",
          },
        ])
      )
      .catch((error) => {
        console.log(error);
      });
  }

  if (client.phone != undefined) {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("Property", {
            screen: "PropertyDetail",
            params: { propertyId: propertyId, visitAsked: scheduled },
          })
        }
      >
        <View
          style={[styles.container, { height: scheduled == 1 ? 425 : 450 }]}
        >
          <Image
            source={{ uri: property.featured_image }}
            containerStyle={styles.image}
            PlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{
              height: 250,
              width: screenWidth - 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <TouchableWithoutFeedback onPress={() => console.log("Stauts")}>
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
          <View style={styles.propertyAgentZone}>
            <Image
              source={{
                uri: client.profile_pic
                  ? client.profile_pic
                  : "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
              }}
              style={styles.agentImage}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View>
              <Text style={[styles.agentName, { marginTop: 10 }]}>
                {" "}
                {client.firstname} {client.lastname}{" "}
              </Text>
              <TouchableOpacity>
                {visit.visit_done ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.buttonContainer}
                  >
                    <Text style={styles.button}>Visite déja effectuer</Text>
                  </TouchableOpacity>
                ) : (
                  <CheckBox
                    title="Marquer comme visité"
                    checked={visit.visit_done}
                    size={17}
                    iconRight={true}
                    textStyle={{ fontSize: 15 }}
                    containerStyle={{
                      backgroundColor: "white",
                      padding: 10,
                    }}
                    onPress={() => setVisited(visit.id)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {scheduled != 1 ? (
            <Rating
              count={5}
              imageSize={30}
              startingValue={1}
              type="heart"
              defaultRating={0}
              size={1}
              ratingColor="#203260"
              style={{
                height: 40,
                marginTop: -15,
                marginLeft: 65,
              }}
              readonly={scheduled == 2 ? true : false}
              onFinishRating={(val) => rateVisite(val, visit.id)}
            ></Rating>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("Property", {
            screen: "PropertyDetail",
            params: { propertyId: propertyId, visitAsked: scheduled },
          })
        }
      >
        <View style={styles.container}>
          <Image
            source={{ uri: property.featured_image }}
            containerStyle={styles.image}
            PlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{
              height: 250,
              width: screenWidth - 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <TouchableWithoutFeedback onPress={() => console.log("Stauts")}>
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
          <View style={styles.propertyAgentZone}>
            <Image
              source={{
                uri: agent.profile_pic
                  ? agent.profile_pic
                  : "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
              }}
              style={styles.agentImage}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View>
              <Text style={styles.agentName}>
                {" "}
                {agent.firstname} {agent.lastname}{" "}
              </Text>
              <TouchableOpacity>
                {visit.visit_done ? (
                  <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.button}>Visite effectuée</Text>
                  </TouchableOpacity>
                ) : (
                  <CheckBox
                    title="Marquer comme visité"
                    checked={visit.visit_done}
                    size={17}
                    iconRight={true}
                    textStyle={{ fontSize: 13 }}
                    containerStyle={{
                      backgroundColor: "#f1f1f1",
                      borderRadius: 10,
                      marginLeft: 27,
                      marginBottom: 15,
                    }}
                    onPress={() => setVisited(visit.id)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Rating
            count={5}
            imageSize={30}
            startingValue={1}
            type="heart"
            defaultRating={0}
            size={1}
            ratingColor="#203260"
            style={{
              height: 40,
              marginTop: -25,
              marginLeft: 65,
            }}
            readonly={scheduled == 2 ? true : false}
            onFinishRating={(val) => rateVisite(val, visit.id)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 450,
    width: screenWidth - 20,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16.0,
    elevation: 2,
    marginVertical: 10,
    backgroundColor: "white",
  },
  image: {
    height: 200,
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
    marginTop: 200,
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
    fontSize: 15,
    marginTop: 5,
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
  agentName: {
    fontSize: 20,
    marginTop: 5,
    marginLeft: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
  buttonContainer: {
    marginLeft: 28,
    borderRadius: 10,
    width: screenWidth - 210,
    height: 40,
    backgroundColor: "#5a86d8",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 17,
    padding: 10,
    color: "#fff",

    fontWeight: "bold",
    textAlign: "center",
  },
  visiteAskedButtonContainer: {
    marginLeft: 25,
    borderRadius: 20,
    width: screenWidth - 185,
    height: 50,
    backgroundColor: "#ff6363",
  },
  propertyAgentZone: {
    flexDirection: "row",
    width: screenWidth,
    padding: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  agentImage: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default VisitScheduled;
