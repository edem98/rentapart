import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import PropertyImage from "../components/PropertyImage";
import axios from "axios";
import { Input } from "react-native-elements";
// Icon
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import Loading component
import Loading from "../components/Loading";
// Import Dropdown
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class AddProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bedrooms: this.props.route.params.property.bedrooms
        ? this.props.route.params.property.bedrooms
        : "",
      shower: this.props.route.params.property.bathrooms
        ? this.props.route.params.property.bathrooms
        : "",
      garages: this.props.route.params.property.garages
        ? this.props.route.params.property.garages
        : "",
      surface: this.props.route.params.property.surface
        ? this.props.route.params.property.surface
        : "",
      price: this.props.route.params.property.price
        ? this.props.route.params.property.price
        : "",
      title: this.props.route.params.property.title
        ? this.props.route.params.property.title
        : "",
      households: this.props.route.params.property.households
        ? this.props.route.params.property.households
        : "",
      address: this.props.route.params.property.address
        ? this.props.route.params.property.address
        : "",
      description: this.props.route.params.property.description
        ? this.props.route.params.property.description
        : "",
      propertyType: this.props.route.params.property.type
        ? this.props.route.params.property.type
        : "",
      status: this.props.route.params.property.status
        ? this.props.route.params.property.status
        : "",
      quartier: this.props.route.params.property.district
        ? this.props.route.params.property.district
        : "",
      propertiesFeature: [],
      districts: [],
      mainImage: this.props.route.params.property.featured_image
        ? this.props.route.params.property.featured_image
        : "https://picsum.photos/200/300",
      secondImage: this.props.route.params.property.second_image
        ? this.props.route.params.property.second_image
        : "https://picsum.photos/200/300",
      thirdImage: this.props.route.params.property.third_image
        ? this.props.route.params.property.third_image
        : "https://picsum.photos/200/300",
      isAdding: false,
      status: this.props.route.params.property.status ? this.props.route.params.property.status : "",
    };
  }

  componentDidMount() {
    this.getPropertyFeatures();
    this.getCities();
  }

  toogleCheck = (id) => {
    this.setState({
      propertiesFeature: this.state.propertiesFeature.map((item) =>
        item.id == id ? { ...item, checked: !item.checked } : item
      ),
    });
  };

  getPropertyFeatures = async () => {
    // extract property features if is an update
    const { property_features } = this.props.route.params.property
      ? this.props.route.params.property
      : null;
    // create request
    const api = axios.create({
      baseURL: `https://www.alkebulan-immo.com/api/property/list-features/`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    // send request and get back the property
    let propertiesFeature = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data);
      });
    if (propertiesFeature) {
      let features = [];
      if (property_features) {
        propertiesFeature.results.forEach((element) => {
          if (property_features.some((elt) => elt.id === element.id)) {
            features.push({
              name: element.name,
              checked: true,
              id: element.id,
            });
          } else {
            features.push({
              name: element.name,
              checked: false,
              id: element.id,
            });
          }
        });
      } else {
        propertiesFeature.results.forEach((element) => {
          features.push({ name: element.name, checked: false, id: element.id });
        });
      }
      this.setState({
        propertiesFeature: features,
      });
    } else {
      console.log("Aucune propriété associé");
    }
  };

  getCities = async () => {
    // create request
    const api = axios.create({
      baseURL: `https://www.alkebulan-immo.com/api/property/list-district/`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    // send request and get back the property
    let districts = await api
      .get(`/`)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data);
      });
    if (districts) {
      let formatedCities = [];
      districts.results.forEach((element) => {
        formatedCities.push({ label: element.name, value: element.id });
      });
      this.setState({
        districts: formatedCities,
      });
    } else {
      console.log("Aucun quariter associé");
    }
  };

  addProperty = () => {
    this.createProperty();
  };

  updateImage = (imageType, image) => {
    if (imageType == "main") {
      this.setState({
        mainImage: image,
      });
    } else if (imageType == "second") {
      this.setState({
        secondImage: image,
      });
    } else if (imageType == "third") {
      this.setState({
        thirdImage: image,
      });
    } else {
      return;
    }
  };

  getFile = async (url) => {
    const img_url = url;
    let result = await fetch(img_url);
    return result;
  };

  createProperty = async () => {
    // start showing loading component
    this.setState({
      isAdding: true,
    });

    const {
      bedrooms,
      shower,
      garages,
      surface,
      price,
      description,
      title,
      propertyType,
      status,
      quartier,
      households,
      propertiesFeature,
      mainImage,
      secondImage,
      thirdImage,
      address,
    } = this.state;

    // extract selected features
    let property_features = [];
    propertiesFeature.forEach((item) => {
      if (item.checked == true) {
        property_features.push(item.id);
      }
    });

    let form_data = new FormData();

    if (title) {
      form_data.append("title", title);
    }
    if (description) {
      form_data.append("description", description);
    }
    if (bedrooms) {
      form_data.append("bedrooms", bedrooms);
    }
    if (shower) {
      form_data.append("bathrooms", shower);
    }
    if (garages) {
      form_data.append("garages", garages);
    }
    if (surface) {
      form_data.append("surface", surface);
    }
    if (price) {
      form_data.append("price", price);
    }
    if (propertyType) {
      form_data.append("type", propertyType);
    }
    if (status) {
      form_data.append("status", status);
    }
    if (quartier) {
      form_data.append("district", quartier);
    }
    if (households) {
      form_data.append("households", households);
    }
    if (propertiesFeature) {
      form_data.append("property_features", JSON.stringify(property_features));
    }
    if (mainImage) {
      form_data.append("featured_image", {
        uri: mainImage,
        name: this.state.title + ".jpg",
        type: "jpeg",
      });
    }
    if (secondImage) {
      form_data.append("second_image", {
        uri: secondImage,
        name: this.state.title + "2.jpg",
        type: "jpeg",
      });
    }
    if (thirdImage) {
      form_data.append("third_image", {
        uri: thirdImage,
        name: this.state.title + "3.jpg",
        type: "jpeg",
      });
    }
    if (address) {
      form_data.append("address", address);
    }
    form_data.append("agent", this.props.user.id);

    // create request
    const api = axios.create({
      baseURL: `https://www.alkebulan-immo.com/api/property/create/`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // post or put request based on update state
    if (this.props.route.params.update) {
      form_data.append("id", this.props.route.params.property.id);
      await api
        .put(`/`, form_data)
        .then((res) => {
          Alert.alert("SUCCÈS!!", "La propriété a été ajouter avec succès", [
            {
              text: "Fermer",
            },
          ]);
        })
        .catch((error) => {
          Alert.alert(
            "ERREUR!!",
            "Une erreur s'est produite lors de l'ajout. \n Nous reglerons ce problème dans les plus bref délais",
            [
              {
                text: "Fermer",
              },
            ]
          );
          console.log(error);
        });
    } else {
      await api
        .post(`/`, form_data)
        .then((res) => {
          Alert.alert("SUCCÈS!!", "La propriété à été ajouter avec succès", [
            {
              text: "Fermer",
            },
          ]);
        })
        .catch((error) => {
          alert(
            "Impossible de mettre à jour la propriété. Nous reglerons ce problème sous peu. Merci de votre patience"
          );
          console.log(error);
        });
    }
    this.setState({
      isAdding: false,
    });
  };

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {this.state.isAdding ? (
          <Loading text="Enrégistrement en cours..." />
        ) : (
          <View style={[styles.wrapper, styles.container]}>
            <DropDownPicker
              items={[
                { label: "Une pièce", value: "Une pièce" },
                { label: "Chambre Salon", value: "Chambre Salon" },
                { label: "2 chambres Salon", value: "2 chambres Salon" },
                { label: "Villa", value: "Villa" },
                { label: "Appartement", value: "Appartement" },
                { label: "Bureau", value: "Bureau" },
                { label: "Terrain", value: "Terrain" },
              ]}
              searchable={true}
              searchablePlaceholder="Recheche..."
              searchableError="Aucun résultat"
              placeholder="Type de propriété"
              labelStyle={{ fontSize: 17, color: "#000", fontWeight: "400" }}
              defaultValue={this.props.route.params.property.type}
              containerStyle={{
                height: 50,
                width: screenWidth - 40,
                marginVertical: 10,
              }}
              showArrowIcon={false}
              style={{ backgroundColor: "#fff" }}
              dropDownStyle={{
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                width: screenWidth - 40,
              }}
              dropDownMaxHeight={300}
              onChangeItem={(item) => {
                if (item.value == "Une pièce") {
                  this.setState({
                    propertyType: item.value,
                    bedrooms: 1,
                  });
                } else if (item.value == "Chambre Salon") {
                  this.setState({
                    propertyType: item.value,
                    bedrooms: 2,
                  });
                } else if (item.value == "2 chambres Salon") {
                  this.setState({
                    propertyType: item.value,
                    bedrooms: 3,
                  });
                } else {
                  this.setState({
                    propertyType: item.value,
                  });
                }
              }}
            />
            <DropDownPicker
              items={[
                { label: "Location", value: "A Louer" },
                { label: "Vente", value: "A Vendre" },
                { label: "Baille", value: "A Bailler" },
              ]}
              searchable={true}
              searchablePlaceholder="Recheche..."
              searchableError="Aucun résultat"
              placeholder="Type de bien"
              labelStyle={{ fontSize: 17, color: "#000", fontWeight: "400" }}
              defaultValue={this.props.route.params.property.type}
              containerStyle={{
                height: 50,
                width: screenWidth - 40,
                marginVertical: 10,
              }}
              showArrowIcon={false}
              style={{ backgroundColor: "#fff" }}
              dropDownStyle={{
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                width: screenWidth - 40,
              }}
              dropDownMaxHeight={300}
              onChangeItem={(item) =>
                this.setState({
                  status: item.value,
                })
              }
            />
            <Input
              placeholder="Nom de la propriété"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={<FontAwesome name="home" size={30} color="#5a86d8" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  title: val,
                });
              }}
              defaultValue={this.state.title.toString()}
            />
            <Input
              placeholder="Description"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={
                <MaterialIcons name="description" size={30} color="#5a86d8" />
              }
              containerStyle={styles.elementSpacing}
              multiline={true}
              onChangeText={(val) => {
                this.setState({
                  description: val,
                });
              }}
              defaultValue={this.state.description.toString()}
            />
            {this.state.propertyType == "Une pièce" ||
              this.state.propertyType == "Chambre Salon" ||
              this.state.propertyType == "2 chambres Salon" ? null : (
              <Input
                placeholder="Nombre de chambre/salle"
                placeholderTextColor={"black"}
                inputStyle={{ color: "black", marginLeft: 10 }}
                leftIcon={<FontAwesome name="bed" size={30} color="#5a86d8" />}
                keyboardType={"numeric"}
                containerStyle={styles.elementSpacing}
                onChangeText={(val) => {
                  this.setState({
                    bedrooms: val,
                  });
                }}
                defaultValue={this.state.bedrooms.toString()}
              />
            )}
            <Input
              placeholder="Nombre de douche"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={<FontAwesome name="shower" size={30} color="#5a86d8" />}
              containerStyle={styles.elementSpacing}
              keyboardType={"numeric"}
              onChangeText={(val) => {
                this.setState({
                  shower: val,
                });
              }}
              defaultValue={this.state.shower.toString()}
            />
            <Input
              placeholder="Place de garages"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={
                <FontAwesome5 name="parking" size={30} color="#5a86d8" />
              }
              containerStyle={styles.elementSpacing}
              keyboardType={"numeric"}
              onChangeText={(val) => {
                this.setState({
                  garages: val,
                });
              }}
              defaultValue={this.state.garages.toString()}
            />
            {this.state.propertyType == "Terrain" ? (
              <Input
                placeholder="Nombre de lot"
                placeholderTextColor={"black"}
                inputStyle={{ color: "black", marginLeft: 10 }}
                leftIcon={
                  <MaterialIcons name="landscape" size={30} color="#5a86d8" />
                }
                containerStyle={styles.elementSpacing}
                keyboardType={"numeric"}
                onChangeText={(val) => {
                  this.setState({
                    surface: val,
                  });
                }}
                defaultValue={this.state.surface.toString()}
              />
            ) : null}
            {this.state.districts.length == 0 ? null : (
              <DropDownPicker
                items={this.state.districts}
                placeholder="Quartier"
                labelStyle={{ fontSize: 17, color: "#000", fontWeight: "400" }}
                defaultValue={this.state.quartier}
                containerStyle={{
                  height: 50,
                  width: screenWidth - 40,
                }}
                searchable={true}
                zIndex={10000}
                searchablePlaceholder="Recheche..."
                searchableError="Aucun résultat"
                style={{ backgroundColor: "#fff" }}
                dropDownStyle={{
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  width: screenWidth - 40,
                }}
                dropDownMaxHeight={300}
                onChangeItem={(item) =>
                  this.setState({
                    quartier: item.value,
                  })
                }
              />
            )}
            <Input
              placeholder="Adresse de la propriété"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={<FontAwesome name="home" size={30} color="#5a86d8" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  address: val,
                });
              }}
              defaultValue={this.state.address.toString()}
            />
            <Input
              placeholder="Prix"
              placeholderTextColor={"black"}
              inputStyle={{ color: "black", marginLeft: 10 }}
              leftIcon={<FontAwesome name="money" size={30} color="#5a86d8" />}
              containerStyle={styles.elementSpacing}
              keyboardType={"numeric"}
              onChangeText={(val) => {
                this.setState({
                  price: val,
                });
              }}
              defaultValue={this.state.price.toString()}
            />
            {this.state.propertyType == "Une pièce" ||
              this.state.propertyType == "Chambre Salon" ||
              this.state.propertyType == "2 chambres Salon" ? (
              <Input
                placeholder="Nombre de ménages"
                placeholderTextColor={"black"}
                inputStyle={{ color: "black", marginLeft: 10 }}
                leftIcon={
                  <FontAwesome name="group" size={30} color="#5a86d8" />
                }
                containerStyle={styles.elementSpacing}
                keyboardType={"numeric"}
                onChangeText={(val) => {
                  this.setState({
                    households: val,
                  });
                }}
                defaultValue={this.state.households.toString()}
              />
            ) : null}
            <DropDownPicker
              items={[
                { label: "A Louer", value: "A Louer" },
                { label: "A Vendre", value: "A Vendre" },
                { label: "A Bailler", value: "A Bailler" },
              ]}
              placeholder="Status de la propriété"
              labelStyle={{ fontSize: 17, color: "#000", fontWeight: "400" }}
              defaultValue={this.state.status}
              containerStyle={{
                height: 50,
                width: screenWidth - 40,
                marginBottom: 15,
              }}
              style={{ backgroundColor: "#fff" }}
              dropDownStyle={{
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                width: screenWidth - 40,
              }}
              defaultValue={this.state.status}
              // dropDownMaxHeight={400}
              onChangeItem={(item) =>
                this.setState({
                  status: item.value,
                })
              }
            />
            <Text style={styles.description}>Options supplémentaires</Text>
            <View style={styles.commodityZone}>
              {this.state.propertiesFeature.map((item, index) => {
                return (
                  <CheckBox
                    title={item.name}
                    checked={item.checked}
                    size={30}
                    key={index}
                    iconRight={true}
                    containerStyle={{
                      backgroundColor: "white",
                      borderRadius: 30,
                      width: screenWidth / 2 - 30,
                    }}
                    onPress={() => this.toogleCheck(item["id"])}
                  />
                );
              })}
            </View>
            <Text style={[styles.description, { marginTop: 20 }]}>
              Images de la Propriété
            </Text>
            <PropertyImage
              updateImage={this.updateImage}
              imageType="main"
              defaultImage={this.state.mainImage}
            />
            <PropertyImage
              updateImage={this.updateImage}
              imageType="second"
              defaultImage={this.state.secondImage}
            />
            <PropertyImage
              updateImage={this.updateImage}
              imageType="third"
              defaultImage={this.state.thirdImage}
            />
            <TouchableOpacity
              style={[styles.elementSpacing, styles.loginZone]}
              onPress={this.addProperty}
            >
              <Ionicons
                name="ios-add-circle-outline"
                size={30}
                color="white"
                style={{ marginTop: 3 }}
              />
              <Text style={styles.loginText}>
                {this.props.route.params.update
                  ? "Mettre à jour"
                  : "Ajouter la propriété"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(AddProperty);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    padding: 20,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  commodityZone: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth - 20,
    flexWrap: "wrap",
  },
  description: {
    fontSize: 23,
    fontWeight: "bold",

    marginVertical: 15,
  },
  loginZone: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "blue",
    borderWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    marginTop: 30,
    backgroundColor: "#203260",
  },
  elementSpacing: {
    marginVertical: 5,
  },
  loginText: {
    fontSize: 20,
    color: "white",
    marginLeft: 10,
  },
});
