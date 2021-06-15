import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import utilities
import { Input } from "react-native-elements";
// Icon
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
// Import Dropdown
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class FilterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bedrooms: 0,
      shower: 0,
      garages: 0,
      surface: 0,
      minPrice: 0,
      maxPrice: 0,
      propertyType: "",
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.translateY, {
      toValue: -screenHeight,
      duration: 350,
    }).start();
  }

  unmount = () => {
    Animated.timing(this.state.translateY, {
      toValue: screenHeight,
      duration: 350,
    }).start();
    setTimeout(() => {
      this.props.closeFilter();
    }, 500);
    //this.props.closeFilter();
  };

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: this.state.translateY }] },
        ]}
      >
        <View style={styles.filterZone}>
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
            placeholder="Type de propriété"
            labelStyle={{ fontSize: 17, color: "#000", fontWeight: "400" }}
            defaultValue={this.state.propertyType}
            containerStyle={{
              height: 50,
              width: screenWidth - 80,
              marginBottom: 3,
            }}
            style={{ backgroundColor: "#fff" }}
            dropDownStyle={{
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              width: screenWidth - 80,
            }}
            dropDownMaxHeight={400}
            onChangeItem={(item) =>
              this.setState({
                propertyType: item.value,
              })
            }
          />
          {this.state.propertyType == "Une pièce" ||
          this.state.propertyType == "Chambre Salon" ||
          this.state.propertyType == "2 chambres Salon" ||
          this.state.propertyType == "Terrain" ||
          this.state.propertyType == "Bureau" ? null : (
            <Input
              placeholder="Nombre de chambre"
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
            />
          )}
          {this.state.propertyType == "Bureau" ? (
            <Input
              placeholder="Nombre de salle"
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
            />
          ) : null}
          {this.state.propertyType == "Une pièce" ||
          this.state.propertyType == "Chambre Salon" ||
          this.state.propertyType == "2 chambres Salon" ||
          this.state.propertyType == "Terrain" ? null : (
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
            />
          )}

          {this.state.propertyType != "Terrain" ||
          this.state.propertyType == "Une pièce" ? (
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
            />
          ) : null}
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
            />
          ) : null}
          <Input
            placeholder="Prix minimum"
            placeholderTextColor={"black"}
            inputStyle={{ color: "black", marginLeft: 10 }}
            leftIcon={<FontAwesome name="money" size={30} color="#5a86d8" />}
            containerStyle={styles.elementSpacing}
            keyboardType={"numeric"}
            onChangeText={(val) => {
              this.setState({
                minPrice: val,
              });
            }}
          />
          <Input
            placeholder="Prix maximum"
            placeholderTextColor={"black"}
            inputStyle={{ color: "black", marginLeft: 10 }}
            leftIcon={<FontAwesome name="money" size={30} color="#5a86d8" />}
            containerStyle={styles.elementSpacing}
            keyboardType={"numeric"}
            onChangeText={(val) => {
              this.setState({
                maxPrice: val,
              });
            }}
          />
          <TouchableOpacity
            onPress={() => this.props.search(this.state)}
            style={[styles.elementSpacing, styles.loginZone]}
          >
            <AntDesign name="search1" size={30} color="white" />
            <Text style={styles.loginText}>Rechercher</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.unmount} style={[styles.closeFilter]}>
            <AntDesign name="closecircleo" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (user) => dispatch(signIn(user)),
  };
};

export default connect(null, mapDispatchToProps)(FilterModal);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: screenHeight,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  filterZone: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
    width: screenWidth - 50,

    backgroundColor: "white",
    borderRadius: 15,
    marginTop: -80,
  },
  elementSpacing: {
    marginVertical: -5,
  },
  loginZone: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    backgroundColor: "#5a86d8",
    borderWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  closeFilter: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    backgroundColor: "red",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    paddingTop: 3,
  },
  loginText: {
    fontSize: 20,
    color: "white",
    marginLeft: 10,
  },
});
