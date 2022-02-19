import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Header, Input } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
// axios
import axios from "axios";
// import auth action
import { changePassword } from "../actions/authAction";
import { connect } from "react-redux";
// Loading component
import Loading from "../components/Loading";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      isUpdating: false,
    };
  }

  isValidCredentials = () => {
    const { oldPassword, newPassword } = this.state;
    if (oldPassword != newPassword && newPassword.length >= 8) {
      return true;
    } else {
      false;
    }
  };

  update = async () => {
    this.setState({
      isUpdating: true,
    });
    if (this.isValidCredentials()) {
      let url =
        `${API_CONFIG.server_url}/api/operations/user-change-password/`;

      // create request
      const api = axios.create({
        baseURL: url,
        headers: {
          Authorization: `Token ${this.props.user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { oldPassword, newPassword } = this.state;
      // send request for a visit on the current property

      let form_data = new FormData();
      form_data.append("old_password", oldPassword);
      form_data.append("new_password", newPassword);

      await api
        .put(`/`, form_data)
        .then((res) => {
          Alert.alert("SUCCÈS!!", res["response"], [
            {
              text: "Fermer",
              onPress: () => {
                this.props.changePassword(newPassword);
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert("ERREUR!!", "Votre ancien mot de passe est érroné", [
            {
              text: "Fermer",
              onPress: () => {
                this.props.changePassword(newPassword);
              },
            },
          ]);
          console.log(error.toString());
        });
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
            <Ionicons
              name="ios-arrow-back"
              color="white"
              size={23}
              style={{ paddingLeft: 15 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={{
            text: "Mot de passe",
            style: { color: "#fff", fontSize: 20 },
          }}
          containerStyle={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#2C497F",
          }}
        />
        {this.state.isUpdating ? (
          <Loading text="Mise à jour en cour..." />
        ) : (
          <View
            style={{
              width: "90%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="vpn-key" size={100} color="white"
              style={{ marginBottom: 30, marginTop: 10 }} />
            <Input
              placeholder="Ancien mot de passe"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              secureTextEntry={true}
              leftIcon={<FontAwesome name="key" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  oldPassword: val.toLowerCase(),
                });
              }}
            />
            <Input
              placeholder="Nouveau mot de passe"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              secureTextEntry={true}
              leftIcon={<FontAwesome name="key" size={30} color="white" />}
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  newPassword: val.toLowerCase(),
                });
              }}
            />
            <TouchableOpacity onPress={this.update} style={[styles.loginZone]}>
              <MaterialCommunityIcons name="update" size={30} color="white" />
              <Text style={styles.loginText}>Mettre à jour</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (password) => dispatch(changePassword(password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

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
    marginVertical: 10,
    width: "90%",
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
