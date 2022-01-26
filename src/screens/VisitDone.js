import React from "react";
import { StyleSheet, FlatList, Dimensions, View } from "react-native";
import Search from "../components/Searching";
import axios from "axios";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import Visit
import VisitScheduled from "../components/VisitComponent";
// import not found component
import NotFound from "../components/NotFound";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class VisitDone extends React.Component {
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
        const propertyId = this.props.route.params.propertyId;
        this.getProperty(propertyId);
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  }

  getVisits = async () => {
    const api = axios.create({
      baseURL: `https://www.alkebulan-immo.com/api/operations/get-visit-done/`,
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
      return <NotFound text="Aucune Visite effectuée" />;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.visits}
            renderItem={({ item }) => (
              <View style={styles.space}>
                <VisitScheduled
                  visit={item}
                  propertyId={item.property}
                  visitclient={item.client}
                  navigation={this.props.navigation}
                  token={this.props.user.token}
                  setVisited={this.markVisited}
                  scheduled={2}
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

export default connect(mapStateToProps, mapDispatchToProps)(VisitDone);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
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
