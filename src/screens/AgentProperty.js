import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import Property from "../components/PropertySwitch";
import axios from "axios";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// Icon
import { Ionicons } from "@expo/vector-icons";
// Not found and search component
import Search from "../components/Searching";
import NotFound from "../components/NotFound";

class AgentProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      properties: [],
      isLoading: true,
      next: null,
      url: `https://www.alkebulan-immo.com/api/property/agent-property-list`,
      isSearching: false,
    };
  }

  componentDidMount() {
    this.getProperties(this.state.url);
  }

  loadMore = () => {
    if (this.state.next != null) {
      this.getProperties(this.state.next);
    }
  };

  toogleProperty = (id) => {
    let properties = this.state.properties;
    properties.forEach((item) => {
      if (item.id == id) {
        item.is_active = !item.is_active;
        this.updateDatabase(id);
      }
    });

    this.setState({
      properties: properties,
    });
  };

  updateDatabase = async (id) => {
    // create request
    const api = axios.create({
      baseURL: `https://www.alkebulan-immo.com/api/property/toggle-property-active/${id}`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    // send request and get back the agent in charge of the property
    await api
      .put(`/`)
      .then((res) => console.log(res.data["response"]))
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  getProperties = async (url) => {
    const api = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    let data = await api
      .get("")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });

    if (data.next != null) {
      this.setState({
        next: data.next,
      });
    } else {
      this.setState({
        next: null,
      });
    }
    data.results.forEach((property) => {
      this.setState({
        properties: [...this.state.properties, property],
      });
    });
    this.setState({
      isLoading: false,
    });
  };

  render() {
    if (this.state.properties.length === 0 && this.state.isLoading == true) {
      return <Search />;
    } else if (
      this.state.properties.length == 0 &&
      this.state.isLoading == false
    ) {
      return <NotFound text="Aucune propriété ajoutée" />;
    }
    return (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={this.state.properties}
          renderItem={({ item }) => (
            <Property
              property={item}
              navigation={this.props.navigation}
              toogleProperty={this.toogleProperty}
            />
          )}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0}
        />
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AgentProperty);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  searchIconContainer: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#5a86d8",
    zIndex: 1000,
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
  space: {
    marginVertical: 10,
  },
  noResult: {
    fontSize: 22,
    fontWeight: "400",
    marginRight: 10,
  },
});
