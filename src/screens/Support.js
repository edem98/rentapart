import React from "react";
import { StyleSheet, Text, Dimensions, View } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Support extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 25, marginBottom: 20 }}>Contact</Text>
        <Text style={{ fontSize: 17, marginBottom: 10 }}>
          Email: support@alkebulan.com
        </Text>
        <Text style={{ fontSize: 17, marginBottom: 10 }}>
          phone: +228-98-60-20-51
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (user) => dispatch(signIn(user)),
  };
};

export default connect(null, mapDispatchToProps)(Support);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
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
