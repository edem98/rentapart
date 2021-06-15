import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import axios from "axios";
// import auth action
import { signUp } from "../actions/authAction";
import { connect } from "react-redux";
// loading component
import Loading from "../components/Loading";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      password2: "",
      isCreating: false,
    };
  }

  isValidCredentials = () => {
    const { phone, password, password2 } = this.state;
    if (phone.length < 8 || password.length < 4 || password !== password2) {
      return false;
    }
    return true;
  };

  setUser = async (token) => {
    // create request
    let url = "";
    if (this.props.user.userType === "client") {
      url = `http://127.0.0.1:8000/api/operations/client/account/`;
    } else if (this.props.user.userType === "agent") {
      url = `http://127.0.0.1:8000/api/operations/agent/account/`;
    }
    const api = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request for a visit on the current property
    let data = await api
      .get("/")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });
    this.props.signUp({
      email: data["email"],
      id: data["id"],
      firstname: data["firstname"],
      lastname: data["lastname"],
      profile_pic: data["profile_pic"],
      phone: this.state.phone,
      password: this.state.password,
      token: token,
    });
  };

  fetchUserType = async (token) => {
    // create request
    const api = axios.create({
      baseURL: `http://127.0.0.1:8000/api/operations/account/type/`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request for a visit on the current property
    let data = await api
      .get("/")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });
    this.props.setUserType({ userType: data["type"] });
    this.setUser(token);
  };

  createAccount = async () => {
    this.setState({
      isCreating: true,
    });
    if (this.isValidCredentials()) {
      // create request
      const api = axios.create({
        baseURL: `https://rentapart.herokuapp.com/api/operations/register/`,
      });
      // send request for a visit on the current property
      await api
        .post(`/`, {
          phone: this.state.phone,
          password: this.state.password,
          password2: this.state.password2,
        })
        .then((res) => {
          Alert.alert("SUCCÈS!!", "Votre compte a été créer avec succès", [
            {
              text: "Fermer",
              onPress: () => {
                this.fetchUserType(res.data["token"]);
              },
            },
          ]);
        })
        .catch((error) => {
          alert(
            "Impossible de créer le compte. Nous reglerons ce problème sous peu. Merci de votre patience"
          );
          console.log(error);
          console.log(this.state);
        });
    } else {
      Alert.alert(
        "ERREUR!!",
        "Veuillez renseigner correctement tous les champs",
        [
          {
            text: "Fermer",
          },
        ]
      );
    }
    this.setState({
      isCreating: false,
    });
  };

  render() {
    return (
      <ImageBackground
        blurRadius={20}
        style={styles.container}
        source={require("../../assets/signInBg.jpg")}
      >
        {this.state.isCreating ? (
          <Loading text="Création du compte en cours..." />
        ) : (
          <>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Input
              placeholder="Numéro de téléphone"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              keyboardType={"numeric"}
              leftIcon={<FontAwesome name="phone" size={30} color="white" />}
              onChangeText={(val) => {
                this.setState({
                  phone: val,
                });
              }}
            />
            <Input
              placeholder="Mot de passe"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              secureTextEntry={true}
              leftIcon={<FontAwesome name="key" size={30} color="white" />}
              onChangeText={(val) => {
                this.setState({
                  password: val,
                });
              }}
            />
            <Input
              placeholder="Confirmer le Mot de passe"
              placeholderTextColor={"white"}
              inputStyle={{ color: "white", marginLeft: 10 }}
              secureTextEntry={true}
              leftIcon={<FontAwesome name="key" size={30} color="white" />}
              onChangeText={(val) => {
                this.setState({
                  password2: val,
                });
              }}
            />
            <TouchableOpacity
              onPress={this.createAccount}
              style={styles.loginZone}
            >
              <AntDesign name="login" size={30} color="white" />
              <Text style={styles.loginText}>Créer un compte</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>Vous avez déja un compte ?</Text>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push("SignIn")}
            >
              <Text style={styles.register}>Connectez-vous</Text>
            </TouchableWithoutFeedback>
          </>
        )}
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (user) => dispatch(signUp(user)),
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logo: {
    height: screenHeight * 0.1,
    width: screenWidth - 30,
    marginTop: screenHeight * 0.05,
    marginBottom: screenHeight * 0.04,
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
