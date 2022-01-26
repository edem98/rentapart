import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
// auth screens
import Splash from "./src/screens/SplashScreen";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
// profile screen
import ProfileScreen from "./src/screens/ProfileScreen";
import ChangePassword from "./src/screens/ChangePassword";
// property screens
import PropertyBail from "./src/screens/PropertyBail";
import PropertyLocation from "./src/screens/PropertyLocation";
import PropertyVente from "./src/screens/PropertyVente";
import PropertyHome from "./src/screens/Property";
import PropertyDetail from "./src/screens/PropertyDetail";
import AddProperty from "./src/screens/AddProperty";
import AgentProperty from "./src/screens/AgentProperty";
// Visit screens
import ScheduledVisit from "./src/screens/ScheduledVisit";
import VisitDone from "./src/screens/VisitDone";
// Submit request
import SubmitRequest from "./src/screens/SubmitRequest";
// Entrust real estate
import EntrustRealEstate from "./src/screens/EntrustRealEstate";
//Support Screen
import Support from "./src/screens/Support";
// custom drawer
import DrawerContent from "./src/screens/DrawerContent";
// import Root reducer and auth action
import { signIn } from "./src/actions/authAction";
import Icon from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";
import Property from "./src/screens/Property";

const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="SignIn" component={SignIn} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

const PropertyStack = createStackNavigator();
const PropertyStackScreen = () => (
  <PropertyStack.Navigator>
    <PropertyStack.Screen
      name="PropertyHome"
      component={PropertyHome}
      options={() => ({
        headerShown: false,
        title: "Acceuil",
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
      })}
    />

    <PropertyStack.Screen
      name="PropertyDetail"
      component={PropertyDetail}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginTop: 2 }
      })}
    />
    <PropertyStack.Screen
      name="AddProperty"
      component={AddProperty}
      options={() => ({
        headerShown: false,
        title: "Nouvelle Propriété",
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
      })}
    />
    <PropertyStack.Screen
      name="AgentProperty"
      component={AgentProperty}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
      })}
    />
  </PropertyStack.Navigator>
);

const PropertyLocationStack = createStackNavigator();
const PropertyLocationStackScreen = () => (
  <PropertyLocationStack.Navigator>
    <PropertyLocationStack.Screen
      name="Renting Property"
      component={PropertyLocation}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
      })}
    />
    <PropertyLocationStack.Screen
      name="PropertyDetail"
      component={PropertyDetail}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
      })}
    />
  </PropertyLocationStack.Navigator>
);

const PropertyVenteStack = createStackNavigator();
const PropertyVenteStackScreen = () => (
  <PropertyVenteStack.Navigator>
    <PropertyVenteStack.Screen
      name="Renting Property"
      component={PropertyVente}
      options={() => ({
        headerShown: false,
        title: "Location",
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
      })}
    />
    <PropertyVenteStack.Screen
      name="PropertyDetail"
      component={PropertyDetail}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
      })}
    />
  </PropertyVenteStack.Navigator>
);

const PropertyBailStack = createStackNavigator();
const PropertyBailStackScreen = () => (
  <PropertyBailStack.Navigator>
    <PropertyBailStack.Screen
      name="Renting Property"
      component={PropertyBail}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
      })}
    />
    <PropertyBailStack.Screen
      name="PropertyDetail"
      component={PropertyDetail}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
      })}
    />
  </PropertyBailStack.Navigator>
);


const ScheduledVisitStack = createStackNavigator();

const ScheduledVisitScreen = () => (
  <ScheduledVisitStack.Navigator>
    <PropertyStack.Screen
      name="ScheduledVisit"
      component={ScheduledVisit}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
      })}
    />
    <PropertyStack.Screen name="PropertyDetail" component={PropertyDetail} />
  </ScheduledVisitStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
  </ProfileStack.Navigator>
);

const VisitDoneStack = createStackNavigator();

const VisitDoneScreen = () => (
  <VisitDoneStack.Navigator>
    <VisitDoneStack.Screen
      name="VisitDone"
      component={VisitDone}
      options={() => ({
        headerShown: false,
        headerTitleStyle: { fontSize: 20 },
      })}
    />
    <VisitDoneStack.Screen name="PropertyDetail" component={PropertyDetail} />
  </VisitDoneStack.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator
    initialRouteName="Property"
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen name="Acceuil" component={PropertyStackScreen} />
    <Drawer.Screen name="Location" component={PropertyLocationStackScreen} />
    <Drawer.Screen name="Vente" component={PropertyVenteStackScreen} />
    <Drawer.Screen name="Bail" component={PropertyBailStackScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} options={{
      headerShown: false,
    }} />
    <Drawer.Screen name="Visites programmées" component={ScheduledVisitScreen} />
    <Drawer.Screen name="Visites effectuées" component={VisitDoneScreen} />
    <Drawer.Screen name="Exprimer un besoin" component={SubmitRequest} />
    <Drawer.Screen name="Confier un bien" component={EntrustRealEstate} />
    <Drawer.Screen name="Support" component={Support} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();

const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={DrawerScreen}
        options={{
          animationEnabled: true,
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false,
        }}
      />
    )}
  </RootStack.Navigator>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
  }

  render() {
    if (this.state.isLoading) {
      return <Splash />;
    }

    const { user } = this.props;
    return (
      <NavigationContainer>
        <RootStackScreen userToken={user.token} />
      </NavigationContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
