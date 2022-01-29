import React from "react";
import { StyleSheet, Dimensions, Image, ImageBackground } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
    };
  }

  render() {
    return (
      <ImageBackground
        blurRadius={20}
        style={styles.container}
        source={require("../../assets/signInBg.jpg")}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </ImageBackground>
    );
  }
}

export default Splash;

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
    marginTop: 20,
    marginBottom: screenHeight * 0.1,
  },
});
