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
  ScrollView,
  View
} from "react-native";
import Checkbox from 'expo-checkbox';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import axios from "axios";
// import auth action
import { signUp, setUserType } from "../actions/authAction";
import { connect } from "react-redux";
// loading component
import Loading from "../components/Loading";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastname: "",
      firstname: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      isCreating: false,
      userType: "client",
    };
  }

  isValidCredentials = () => {
    const { phone, password, password2 } = this.state;
    if (phone.length < 8 || password.length < 4 || password !== password2) {
      return false;
    }
    return true;
  };

  createAccount = async () => {
    this.setState({
      isCreating: true,
    });
    if (this.isValidCredentials()) {
      // create request
      const api = axios.create({
        baseURL: `https://www.alkebulan-immo.com/api/operations/register/`,
      });
      // send request for a visit on the current property
      await api
        .post(`/`, {
          last_name: this.state.lastname,
          first_name: this.state.firstname,
          email: this.state.email,
          phone: this.state.phone,
          password: this.state.password,
          password2: this.state.password2,
          user_type: this.state.userType,
        })
        .then((res) => {
          Alert.alert("SUCCÈS!!", "Votre compte a été créer avec succès", [
            {
              text: "Fermer",
              onPress: () => {
                this.props.setUserType({ userType: this.state.userType });
                this.props.signUp({
                  email: res.data["email"],
                  id: res.data["id"],
                  firstname: res.data["firstname"],
                  lastname: res.data["lastname"],
                  phone: res.data["phone"],
                  password: this.state.password,
                  token: res.data["token"],
                });
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

  setToggleCheckBox = (value) => {
    if (value == true) {
      this.setState({
        userType: "agent",
      });
    }
    else {
      this.setState({
        userType: "client",
      });
    }
  }

  render() {
    return (
      <ImageBackground
        blurRadius={20}
        style={styles.container}
        source={require("../../assets/signInBg.jpg")}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {this.state.isCreating ? (
            <Loading text="Création du compte en cours..." />
          ) : (
            <View>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Input
                placeholder="Nom"
                placeholderTextColor={"white"}
                inputStyle={{ color: "white", marginLeft: 10 }}
                value={this.state.lastname}
                leftIcon={<FontAwesome name="phone" size={30} color="white" />}
                onChangeText={(lastname) => {
                  this.setState({
                    lastname: lastname,
                  });
                }}
              />
              <Input
                placeholder="Prénoms"
                placeholderTextColor={"white"}
                inputStyle={{ color: "white", marginLeft: 10 }}
                value={this.state.firstname}
                leftIcon={<FontAwesome name="phone" size={30} color="white" />}
                onChangeText={(firstname) => {
                  this.setState({
                    firstname: firstname,
                  });
                }}
              />
              <Input
                placeholder="Email"
                placeholderTextColor={"white"}
                inputStyle={{ color: "white", marginLeft: 10 }}
                leftIcon={<FontAwesome name="phone" size={30} color="white" />}
                value={this.state.email}
                onChangeText={(email) => {
                  this.setState({
                    email: email.toLowerCase(),
                  });
                }}
              />
              <Input
                placeholder="Numéro de téléphone"
                placeholderTextColor={"white"}
                inputStyle={{ color: "white", marginLeft: 10 }}
                keyboardType={"numeric"}
                value={this.state.phone}
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
                value={this.state.password}
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
                value={this.state.password2}
                inputStyle={{ color: "white", marginLeft: 10 }}
                secureTextEntry={true}
                leftIcon={<FontAwesome name="key" size={30} color="white" />}
                onChangeText={(val) => {
                  this.setState({
                    password2: val,
                  });
                }}
              />
              <TouchableWithoutFeedback>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={this.state.userType == "agent"}
                    onValueChange={(newValue) => this.setToggleCheckBox(newValue)}
                  />
                  <Text style={styles.checkboxText}>Je suis un agent immobilier</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={this.createAccount}
                style={styles.loginZone}
              >
                <AntDesign name="login" size={25} color="white" />
                <Text style={styles.loginText}>Créer un compte</Text>
              </TouchableOpacity>
              <View style={styles.loginSection}>
                <Text style={styles.registerText}>Vous avez déja un compte ?</Text>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.push("SignIn")}
                >
                  <Text style={styles.register}>Connectez-vous</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (user) => dispatch(signUp(user)),
    setUserType: (userType) => dispatch(setUserType(userType)),
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
    height: screenHeight * 0.2,
    width: screenWidth - 30,
    marginTop: screenHeight * 0.05,
    marginBottom: screenHeight * 0.04,
  },
  loginZone: {
    flexDirection: "row",
    maxWidth: '90%',
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
  },
  registerText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
  register: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    maxWidth: '80%',
  },
  loginSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
