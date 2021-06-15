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
  Platform,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import axios from "axios";
// import auth action
import { signIn, setUserType } from "../actions/authAction";
import { connect } from "react-redux";
// loading component
import Loading from "../components/Loading";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      isConnecting: false,
    };
  }

  isValidCredentials = () => {
    const { phone, password } = this.state;
    if (phone.length < 4 || password.length < 4) {
      return false;
    }
    return true;
  };

  setUser = async (token) => {
    let url = "";
    if (this.props.userType === "client") {
      url = `https://rentapart.herokuapp.com/api/operations/client/account/`;
    } else if (this.props.userType === "agent") {
      url = `https://rentapart.herokuapp.com/api/operations/agent/account/`;
    } else {
      console.log("error occured");
      console.log(url);
    }

    // create request
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
        console.log(error["response"]);
      });

    this.props.signIn({
      email: data["email"],
      id: data["id"],
      userId: data["user"],
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
      baseURL: `https://rentapart.herokuapp.com/api/operations/account/type/`,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // send request for a visit on the current property
    let data = await api
      .get("/")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error["response"]);
      });
    this.props.setUserType({ userType: data["type"] });
    this.setUser(token);
  };

  login = async () => {
    this.setState({
      isConnecting: true,
    });
    if (this.isValidCredentials()) {
      // create request
      const api = axios.create({
        baseURL: `https://rentapart.herokuapp.com/api/operations/login/`,
      });
      // send request for a visit on the current property
      await api
        .post(`/`, {
          username: this.state.phone,
          password: this.state.password,
        })
        .then((res) => {
          Alert.alert("SUCCÈS!!", "Vous vous êtes connectez avec succès", [
            {
              text: "Fermer",
              onPress: () => {
                this.fetchUserType(res.data["token"]);
              },
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
          alert("Votre téléphone et mot de passe ne correspondent pas");
        });
    } else {
      Alert.alert(
        "ERREUR!!",
        "Vos informations d'authentification ne sont pas valident",
        [
          {
            text: "Fermer",
          },
        ]
      );
    }
    this.setState({
      isConnecting: false,
    });
  };

  render() {
    return (
      <ImageBackground
        blurRadius={10}
        style={styles.container}
        source={require("../../assets/signInBg.jpg")}
      >
        {this.state.isConnecting ? (
          <Loading text="Connexion en cours..." />
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
              containerStyle={styles.elementSpacing}
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
              containerStyle={styles.elementSpacing}
              onChangeText={(val) => {
                this.setState({
                  password: val.toLowerCase(),
                });
              }}
            />
            <TouchableOpacity
              onPress={this.login}
              style={[styles.elementSpacing, styles.loginZone]}
            >
              <AntDesign name="login" size={30} color="white" />
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push("SignUp")}
            >
              <Text style={styles.register}>Créer un compte</Text>
            </TouchableWithoutFeedback>
          </>
        )}
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (user) => dispatch(signIn(user)),
    setUserType: (type) => dispatch(setUserType(type)),
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userType: state.auth.userType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

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
