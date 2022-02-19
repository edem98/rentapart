import React from "react";
import { StyleSheet, FlatList, Dimensions, View, Alert } from "react-native";
import axios from "axios";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import Visit
import VisitScheduled from "../components/VisitComponent";
// Icon
import Search from "../components/Searching";
// not found
import NotFound from "../components/NotFound";
import API_CONFIG from "../config/constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class ScheduledVisit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      visits: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getVisits();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getVisits();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  }

  removeVisit = (visitId) => {
    const remainigVisits = this.state.visits.filter((visit) => {
      return visit.id !== visitId;
    });
    this.setState({
      visits: remainigVisits,
    });
  };

  setVisitDone = async (id) => {
    // create request
    const api = axios.create({
      baseURL: `${API_CONFIG.server_url}/api/operations/set-visit-done/${id}/`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    // send request and get back the agent in charge of the property
    await api
      .put(`/`)
      .then((res) =>
        Alert.alert("SUCCÈS!!", res.data["response"], [
          {
            text: "Fermer",
            onPress: () => {
              this.removeVisit(id);
            },
          },
        ])
      )
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  markVisited = (visitId) => {
    this.state.visits.forEach((visit) => {
      if (visit.id === visitId) {
        this.setVisitDone(visitId);
      }
    });
  };

  getVisits = async () => {
    const api = axios.create({
      baseURL: `${API_CONFIG.server_url}/api/operations/get-scheduled-visit/`,
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    });
    let data = await api
      .get("/")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });

    data.results.forEach((visit) => {
      this.setState({
        visits: [...this.state.visits, visit],
      });
    });
    this.setState({
      isLoading: false,
    });
  };

  render() {
    if (this.state.visits.length == 0 && this.state.isLoading == true) {
      return <Search />;
    } else if (this.state.visits.length == 0 && this.state.isLoading == false) {
      return <NotFound text="Aucun rendez-vous programmé" updateData={() => null} />;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.visits}
            renderItem={({ item }) => (
              <View style={styles.space}>
                <VisitScheduled
                  visit={item}
                  visitclient={item.client}
                  propertyId={item.property}
                  navigation={this.props.navigation}
                  token={this.props.user.token}
                  setVisited={this.markVisited}
                  scheduled={1}
                  userType={this.props.userType}
                />
              </View>
            )}
          />
        </View>
      );
    }
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
    userType: state.auth.userType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledVisit);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
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
  registerText: {
    color: "white",
    marginTop: 20,
    fontSize: 20,
  },
  noResult: {
    fontSize: 22,
    fontWeight: "400",
    marginRight: 10,
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
});
