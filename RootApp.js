import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
// auth screens
import Splash from './src/screens/SplashScreen';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
// profile screen
import Profile from './src/screens/Profile';
import ChangePassword from './src/screens/ChangePassword';
// property screens
import PropertyType from './src/screens/PropertyType';
import PropertyHome from './src/screens/Property';
import PropertyDetail from './src/screens/PropertyDetail';
import AddProperty from './src/screens/AddProperty';
import AgentProperty from './src/screens/AgentProperty';
// Visit screens
import ScheduledVisit from './src/screens/ScheduledVisit';
import VisitDone from './src/screens/VisitDone';
//Support Screen
import Support from './src/screens/Support';
// custom drawer
import DrawerContent from './src/screens/DrawerContent';
// import Root reducer and auth action
import { signIn } from './src/actions/authAction';
import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import Property from './src/screens/Property';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode='none'>
    <AuthStack.Screen name='SignIn' component={SignIn} />
    <AuthStack.Screen name='SignUp' component={SignUp} />
  </AuthStack.Navigator>
);

const PropertyStack = createStackNavigator();

const PropertyStackScreen = () => (
  <PropertyStack.Navigator>
    <PropertyStack.Screen
      name='PropertyType'
      component={Property}
      options={({ navigation }) => ({
        title: 'Types de propriété',
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
        headerLeft: (props) => (
          <Icon
            name='ios-menu'
            color='black'
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    {/* <PropertyStack.Screen
      name="PropertyHome"
      component={PropertyHome}
      options={({ navigation }) => ({
        title: "Acceuil",
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
        headerLeft: (props) => (
          <Icon
            name="ios-menu"
            color="black"
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />

    <PropertyStack.Screen
      name="PropertyDetail"
      component={PropertyDetail}
      options={({ navigation }) => ({
        title: "Détails de la propriété",
        headerTitleStyle: { fontSize: 20, marginTop: 2 },
        headerLeft: (props) => (
          <Icon
            name="ios-arrow-back"
            color="black"
            size={30}
            style={{ paddingLeft: 15, marginTop: 5 }}
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    <PropertyStack.Screen
      name="AddProperty"
      component={AddProperty}
      options={({ navigation }) => ({
        title: "Nouvelle Propriété",
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
        headerLeft: (props) => (
          <Icon
            name="ios-menu"
            color="black"
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <PropertyStack.Screen
      name="AgentProperty"
      component={AgentProperty}
      options={({ navigation }) => ({
        title: "Mon Immobilier",
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
        headerLeft: (props) => (
          <Icon
            name="ios-menu"
            color="black"
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    /> */}
  </PropertyStack.Navigator>
);

const ScheduledVisitStack = createStackNavigator();

const ScheduledVisitScreen = () => (
  <ScheduledVisitStack.Navigator>
    <PropertyStack.Screen
      name='ScheduledVisit'
      component={ScheduledVisit}
      options={({ navigation }) => ({
        title: 'Rendez-vous',
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
        headerLeft: (props) => (
          <Icon
            name='ios-menu'
            color='black'
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <PropertyStack.Screen name='PropertyDetail' component={PropertyDetail} />
  </ScheduledVisitStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
  <ProfileStack.Navigator headerMode={null}>
    <ProfileStack.Screen
      name='Profile'
      component={Profile}
      options={({ navigation }) => ({
        title: 'Rendez-vous',
        headerTitleStyle: { fontSize: 20, marginBottom: 2 },
        headerLeft: (props) => (
          <Icon
            name='ios-menu'
            color='black'
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <ProfileStack.Screen name='ChangePassword' component={ChangePassword} />
  </ProfileStack.Navigator>
);

const VisitDoneStack = createStackNavigator();

const VisitDoneScreen = () => (
  <VisitDoneStack.Navigator>
    <VisitDoneStack.Screen
      name='VisitDone'
      component={VisitDone}
      options={({ navigation }) => ({
        title: 'Visites passées',
        headerTitleStyle: { fontSize: 20 },
        headerLeft: (props) => (
          <Icon
            name='ios-menu'
            color='black'
            size={34}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <VisitDoneStack.Screen name='PropertyDetail' component={PropertyDetail} />
  </VisitDoneStack.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator
    initialRouteName='Property
    '
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen name='Property' component={PropertyStackScreen} />
    <Drawer.Screen name='Profile' component={ProfileStackScreen} />
    <Drawer.Screen name='ScheduledVisit' component={ScheduledVisitScreen} />
    <Drawer.Screen name='VisitDone' component={VisitDoneScreen} />
    <Drawer.Screen name='Support' component={Support} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();

const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode='none'>
    {userToken ? (
      <RootStack.Screen
        name='App'
        component={DrawerScreen}
        options={{
          animationEnabled: false,
        }}
      />
    ) : (
      <RootStack.Screen
        name='Auth'
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

    // auth.signOut().then(() => {
    //   console.log('log out');
    // });
    // this.props.setUser({});
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
