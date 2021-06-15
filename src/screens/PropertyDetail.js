import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "react-native-elements";
import Feature from "../components/PropertyFeature";
import Commodity from "../components/Commodity";
import axios from "axios";

// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";

const screenWidth = Dimensions.get("window").width;

class PropertyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      property: {},
      price: 0,
      images: [],
      feature: [],
      agent: {},
      agentAvatar:
        "http://www.tiptoncommunications.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png",
      visitAsked: this.props.route.params.visitAsked,
    };
  }

  componentDidMount() {
    const propertyId = this.props.route.params.propertyId;
    this.getProperty(propertyId);
  }

  formatPrice = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  extractFeatures = (property) => {
    this.setState({
      feature: property.property_features,
    });
  };

  extractAgent = async (id) => {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/operations/agent/account-id/${id}`,
      headers: {
        Authorization: "Token b417a0b5827334c0657861a4dd148741ca517ddf",
      },
    });
    // send request and get back the agent in charge of the property
    let agent = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data);
      });
    if (agent) {
      this.setState({
        agentAvatar: agent.profile_pic,
        agent: agent,
      });
    } else {
      console.log("Aucun agent associé");
    }
  };

  extractImage = (property) => {
    let property_images = [];
    if (property.second_image && property.third_image) {
      property_images.push(
        "http://rentapart.herokuapp.com" + property.featured_image
      );
      property_images.push(
        "http://rentapart.herokuapp.com" + property.second_image
      );
      property_images.push(
        "http://rentapart.herokuapp.com" + property.third_image
      );
    } else if (property.second_image && !property.third_image) {
      property_images.push(
        "http://rentapart.herokuapp.com" + property.featured_image
      );
      property_images.push(
        "http://rentapart.herokuapp.com" + property.second_image
      );
    } else if (!property.second_image && property.third_image) {
      property_images.push(
        "http://rentapart.herokuapp.com" + property.featured_image
      );
      property_images.push(
        "http://rentapart.herokuapp.com" + property.third_image
      );
    } else {
      property_images.push(
        "http://rentapart.herokuapp.com" + property.featured_image
      );
    }
    this.setState({
      images: property_images.reverse(),
    });
  };

  getProperty = async (id) => {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/property/${id}`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
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
      this.extractImage(property);
      this.extractFeatures(property);
      this.extractAgent(property.agent);
      this.setState({
        property: property,
        price: property.price,
      });
    } else {
      console.log("Aucune propriété associé");
    }
  };

  sendVisitRequest = async () => {
    // create request
    const api = axios.create({
      baseURL: `https://rentapart.herokuapp.com/api/operations/schedule-visit/`,
      headers: {
        Authorization: "Token 12264c0b1c602d5e14b09fb3d8a9bc6e7c67d6ef",
      },
    });
    // send request for a visit on the current property
    await api
      .post(`/`, { client: "9", property: this.state.property.id })
      .then((res) =>
        Alert.alert("SUCCÈS!!", res.data["response"], [
          {
            text: "Fermer",
            onPress: () => {
              this.setState({
                visitAsked: true,
              });
            },
          },
        ])
      )
      .catch((error) => alert(error));
  };

  rememberAskedVisit = () => {
    Alert.alert("SUCCÈS!!", "Vous avez déjà effectué cette visite", [
      {
        text: "Fermer",
      },
    ]);
  };

  render() {
    // visite not scheduled on this property
    if (this.state.visitAsked == 0) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback>
            <Text style={styles.status}>{this.state.property.status}</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text style={styles.price}>
              {this.formatPrice(this.state.price)} cfa
            </Text>
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <ScrollView
              snapToInterval={screenWidth}
              decelerationRate="fast"
              horizontal
            >
              {this.state.images.map((source, index) => {
                return (
                  <View key={index}>
                    <Image
                      source={{ uri: source }}
                      style={styles.propertyImage}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.propertyDetailZone}>
              <View style={styles.propertyAgentZone}>
                <Image
                  source={{ uri: "http://rentapart.herokuapp.com" + this.state.agentAvatar }}
                  style={styles.agentImage}
                  PlaceholderContent={<ActivityIndicator />}
                />
                <View>
                  <Text style={styles.agentName}>
                    {" "}
                    {this.state.agent.firstname} {this.state.agent.lastname}{" "}
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.sendVisitRequest}
                  >
                    <Text style={styles.button}>Prendre rendez-vous</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.descriptionZone}>
                <Text style={styles.description}>Description</Text>
                <Text style={styles.descriptionText}>
                  {this.state.property.description}
                </Text>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Commodités</Text>
                <View style={styles.commodityZone}>
                  {this.state.feature.map((item, index) => {
                    return <Commodity name={item.name} key={index} />;
                  })}
                </View>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Caractéristiques</Text>
                <View style={styles.featuresZone}>
                  <Feature
                    name="Chambres - "
                    value={this.state.property.bedrooms}
                  />
                  <Feature
                    name="Douches - "
                    value={this.state.property.bathrooms}
                  />
                  <Feature
                    name="Garages - "
                    value={this.state.property.garages}
                  />
                  <Feature
                    name="Ménages - "
                    value={this.state.property.households}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
    // visite scheduled but not done
    else if (this.state.visitAsked == 1) {
      return (
        <ScrollView>
          <TouchableWithoutFeedback>
            <Text style={styles.status}>{this.state.property.status}</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text style={styles.price}>
              {this.formatPrice(this.state.price)} cfa
            </Text>
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <ScrollView
              snapToInterval={screenWidth}
              decelerationRate="fast"
              horizontal
            >
              {this.state.images.map((source, index) => {
                return (
                  <View key={index}>
                    <Image
                      source={{ uri: source }}
                      style={styles.propertyImage}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.propertyDetailZone}>
              <View style={styles.propertyAgentZone}>
                <Image
                  source={{ uri: "http://rentapart.herokuapp.com" + this.state.agentAvatar }}
                  style={styles.agentImage}
                  PlaceholderContent={<ActivityIndicator />}
                />
                <View>
                  <Text style={styles.agentName}>
                    {" "}
                    {this.state.agent.firstname} {this.state.agent.lastname}{" "}
                  </Text>
                  <TouchableOpacity
                    style={styles.visiteAskedButtonContainer}
                    onPress={this.rememberAskedVisit}
                  >
                    <Text style={styles.button}>Demande en cours</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.descriptionZone}>
                <Text style={styles.description}>Description</Text>
                <Text style={styles.descriptionText}>
                  {this.state.property.description}
                </Text>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Commodités</Text>
                <View style={styles.commodityZone}>
                  {this.state.feature.map((item, index) => {
                    return <Commodity name={item.name} key={index} />;
                  })}
                </View>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Caractéristiques</Text>
                <View style={styles.featuresZone}>
                  <Feature
                    name="Chambres - "
                    value={this.state.property.bedrooms}
                  />
                  <Feature
                    name="Douches - "
                    value={this.state.property.bathrooms}
                  />
                  <Feature
                    name="Garages - "
                    value={this.state.property.garages}
                  />
                  <Feature
                    name="Ménages - "
                    value={this.state.property.households}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
    // visite done
    else {
      return (
        <ScrollView>
          <TouchableWithoutFeedback>
            <Text style={styles.status}>{this.state.property.status}</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text style={styles.price}>
              {this.formatPrice(this.state.price)} cfa
            </Text>
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <ScrollView
              snapToInterval={screenWidth}
              decelerationRate="fast"
              horizontal
            >
              {this.state.images.map((source, index) => {
                return (
                  <View key={index}>
                    <Image
                      source={{ uri: source }}
                      style={styles.propertyImage}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.propertyDetailZone}>
              <View style={styles.propertyAgentZone}>
                <Image
                  source={{ uri: "http://rentapart.herokuapp.com" + this.state.agentAvatar }}
                  style={styles.agentImage}
                  PlaceholderContent={<ActivityIndicator />}
                />
                <View>
                  <Text style={styles.agentName}>
                    {" "}
                    {this.state.agent.firstname} {this.state.agent.lastname}{" "}
                  </Text>
                  <TouchableOpacity
                    style={styles.visiteAskedButtonContainer}
                    onPress={this.rememberAskedVisit}
                  >
                    <Text style={styles.button}>Visit déjà éffectué</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.descriptionZone}>
                <Text style={styles.description}>Description</Text>
                <Text style={styles.descriptionText}>
                  {this.state.property.description}
                </Text>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Commodités</Text>
                <View style={styles.commodityZone}>
                  {this.state.feature.map((item, index) => {
                    return <Commodity name={item.name} key={index} />;
                  })}
                </View>
              </View>
              <View style={styles.caracteristiqueZone}>
                <Text style={styles.caracteristique}>Caractéristiques</Text>
                <View style={styles.featuresZone}>
                  <Feature
                    name="Chambres - "
                    value={this.state.property.bedrooms}
                  />
                  <Feature
                    name="Douches - "
                    value={this.state.property.bathrooms}
                  />
                  <Feature
                    name="Garages - "
                    value={this.state.property.garages}
                  />
                  <Feature
                    name="Ménages - "
                    value={this.state.property.households}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  status: {
    position: "absolute",
    textAlign: "center",
    top: 20,
    left: 15,
    zIndex: 1,
    height: 25,
    width: 90,
    fontSize: 17,
    fontWeight: "bold",
    backgroundColor: "#203260",
    color: "#fff",
    padding: 1,
  },
  price: {
    position: "absolute",
    textAlign: "center",
    top: 20,
    left: 125,
    zIndex: 1,
    height: 25,
    width: 130,
    fontSize: 17,
    fontWeight: "bold",
    backgroundColor: "#ff6363",
    color: "#fff",
    padding: 1,
  },
  space: {
    marginVertical: 10,
  },
  propertyImage: {
    height: 300,
    width: screenWidth,
  },
  propertyDetailZone: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: screenWidth,
  },
  propertyAgentZone: {
    flexDirection: "row",
    width: screenWidth,
    padding: 20,
  },
  agentImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  agentName: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    marginLeft: 25,
    borderRadius: 20,
    width: screenWidth - 155,
    height: 50,
    backgroundColor: "#5a86d8",
  },
  button: {
    fontSize: 18,
    textAlign: "center",
    padding: 13,
    color: "#fff",
    fontWeight: "bold",
  },
  visiteAskedButtonContainer: {
    marginLeft: 25,
    borderRadius: 20,
    width: screenWidth - 155,
    height: 50,
    backgroundColor: "#ff6363",
  },
  descriptionZone: {
    padding: 20,
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  caracteristiqueZone: {
    padding: 20,
    marginTop: -30,
  },
  caracteristique: {
    fontSize: 20,
    fontWeight: "bold",
  },
  featuresZone: {
    marginTop: 15,
  },
  commodityZone: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth - 20,
    flexWrap: "wrap",
  },
});
