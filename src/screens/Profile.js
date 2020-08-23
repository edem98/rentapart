import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import axios from "axios";
import { Avatar, Input, Header } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import Loading from "../components/Loading";

// import auth action
import { updateUser } from "../actions/authAction";
import { connect } from "react-redux";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: this.props.user.phone,
      password: "",
      firstname: this.props.user.firstname ? this.props.user.firstname : "",
      lastname: this.props.user.lastname ? this.props.user.lastname : "",
      email: this.props.user.email ? this.props.user.email : "",
      image: null,
      imageUri: this.props.user.profile_pic
        ? this.props.user.profile_pic.split("?")[0]
        : "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
      imageChanged: false,
      isUpdating: false,
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  isValidCredentials = () => {
    const { phone, email, firstname, lastname } = this.state;
    if (
      phone.length < 4 ||
      firstname.length < 4 ||
      lastname.length < 4 ||
      email == ""
    ) {
      return false;
    }
    return true;
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          imageUri: result.uri,
          imageChanged: true,
          image: result,
        });
      }
    } catch (E) {
      console.log(E);
    }
  };

  update = async () => {
    this.setState({
      isUpdating: true,
    });
    if (this.isValidCredentials()) {
      let url = "";
      if (this.props.userType === "client") {
        url = `https://rentapart.herokuapp.com/api/operations/client/account/update/`;
      } else {
        url = `https://rentapart.herokuapp.com/api/operations/agent/account/update/`;
      }
      // create request
      const api = axios.create({
        baseURL: url,
        headers: {
          Authorization: `Token ${this.props.user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { firstname, lastname, email, phone, image } = this.state;
      // send request for a visit on the current property
      if (this.state.imageChanged == true) {
        let form_data = new FormData();
        form_data.append("firstname", firstname);
        form_data.append("lastname", lastname);
        form_data.append("email", email);
        form_data.append("user", this.props.user.userId);
        form_data.append("profile_pic", {
          uri: image.uri,
          name: this.state.firstname + "-" + this.state.firstname + ".jpg",
          type: "jpeg",
        });

        await api
          .put(`/`, form_data)
          .then((res) => {
            Alert.alert(
              "SUCCÈS!!",
              "Votre profile a été mise à jour avec succès",
              [
                {
                  text: "Fermer",
                  onPress: () => {
                    this.props.updateUser({
                      firstname: res.data["firstname"],
                      lastname: res.data["lastname"],
                      email: res.data["email"],
                      phone: res.data["phone"],
                      profile_pic: res.data["profile_pic"],
                    });
                  },
                },
              ]
            );
          })
          .catch((error) => {
            alert(
              "Impossible de mettre a jour votre profile.\n Nous reglerons ce problème dans les plus bref délais."
            );
            console.log(error);
          });
      } else {
        let form_data = new FormData();
        form_data.append("firstname", firstname);
        form_data.append("lastname", lastname);
        form_data.append("email", email);
        form_data.append("user", this.props.user.userId);
        await api
          .put(`/`, form_data)
          .then((res) => {
            Alert.alert(
              "SUCCÈS!!",
              "Votre profile a été mise à jour avec succès",
              [
                {
                  text: "Fermer",
                  onPress: () => {
                    this.props.updateUser({
                      firstname: res.data["firstname"],
                      lastname: res.data["lastname"],
                      email: res.data["email"].toLowerCase(),
                      phone: res.data["phone"],
                      profile_pic: res.data["profile_pic"],
                    });
                  },
                },
              ]
            );
          })
          .catch((error) => {
            alert("Impossible de mettre à jour le compte.");
            console.log(error);
          });
      }
    } else {
      alert("Les informations entrées ne sont pas valident");
      console.log(this.state);
    }
    this.setState({
      isUpdating: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="ios-menu"
              color="white"
              size={34}
              style={{ paddingLeft: 15, marginBottom: 10 }}
              onPress={() => this.props.navigation.openDrawer()}
            />
          }
          centerComponent={{
            text: "Profile",
            style: { color: "#fff", fontSize: 20, marginBottom: 10 },
          }}
          containerStyle={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 60,
            paddingTop: 20,
            width: "100%",
            backgroundColor: "#2C497F",
          }}
        />
        {this.state.isUpdating ? (
          <Loading text="Mise à jour en cour..." />
        ) : (
          <View
            style={{
              width: "85%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              rounded
              source={{
                uri: this.state.imageUri.split("?")[0],
              }}
              size="xlarge"
              renderPlaceholderContent={<ActivityIndicator />}
              showAccessory
              containerStyle={{ marginVertical: screenHeight * 0.05 }}
              onAccessoryPress={this._pickImage}
            />
            <Input
              placeholder="Prénoms"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              leftIcon={<FontAwesome name="user" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  firstname: val,
                });
              }}
              defaultValue={
                this.props.user.firstname ? this.props.user.firstname : ""
              }
            />
            <Input
              placeholder="Nom"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              leftIcon={<FontAwesome name="user" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  lastname: val,
                });
              }}
              defaultValue={
                this.props.user.lastname ? this.props.user.lastname : ""
              }
            />
            <Input
              placeholder="Email"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              leftIcon={<FontAwesome name="envelope" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  email: val.toLowerCase(),
                });
              }}
              defaultValue={this.props.user.email ? this.props.user.email : ""}
            />
            <Input
              placeholder="Numéro de téléphone"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              keyboardType={"numeric"}
              leftIcon={<FontAwesome name="phone" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  phone: val,
                });
              }}
              defaultValue={this.props.user.phone}
            />
            <TouchableOpacity
              onPress={this.update}
              style={[styles.elementSpacing, styles.loginZone]}
            >
              <MaterialCommunityIcons name="update" size={30} color="white" />
              <Text style={styles.loginText}>Mettre à jour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("ChangePassword")}
            >
              <Text style={{ marginTop: 30, color: "#fff", fontSize: 17 }}>
                Modifier votre mot de passe ?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userType: state.auth.userType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C497F",
  },
  logo: {
    height: screenHeight * 0.1,
    width: screenWidth - 30,
    marginTop: 20,
    marginBottom: screenHeight * 0.1,
  },
  loginZone: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    marginTop: 50,
  },
  elementSpacing: {
    marginVertical: -10,
  },
  loginText: {
    fontSize: 20,
    color: "white",
    marginLeft: 10,
  },
  registerText: {
    color: "white",
    marginTop: 20,
    fontSize: 20,
  },
  register: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
  },
});
