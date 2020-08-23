import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Drawer } from "react-native-paper";
import { Avatar, Text } from "react-native-elements";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

// import auth action
import { signOut } from "../actions/authAction";
import { connect } from "react-redux";

class DrawerContent extends React.Component {
  signOutUser = () => {
    this.props.signOut();
    // this.navigation.navigate("");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...this.props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 30 }}>
                <Avatar
                  rounded
                  source={{
                    uri: this.props.user.profile_pic
                      ? this.props.user.profile_pic.split("?")[0]
                      : "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
                  }}
                  size="large"
                  renderPlaceholderContent={<ActivityIndicator color="#000" />}
                />
                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  {this.props.user.firstname ? (
                    <Text style={styles.title}>
                      {this.props.user.firstname.slice(0, 1)[0].toUpperCase()}
                      {this.props.user.firstname.slice(1)}{" "}
                      {this.props.user.lastname.toUpperCase()}
                    </Text>
                  ) : (
                    <Text style={styles.title}>Prénoms Nom</Text>
                  )}

                  <Text style={styles.caption}>
                    +228{this.props.user.phone}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.row}>
                <View style={styles.section}>
                  <Text
                    style={[styles.paragraph, styles.caption, { fontSize: 16 }]}
                  >
                    Email:{" "}
                  </Text>
                  <Text style={styles.caption}>{this.props.user.email}</Text>
                </View>
              </View> */}
            </View>

            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons name="home" size={24} color="black" />
                )}
                label="Acceuil"
                onPress={() => {
                  this.props.navigation.navigate("Property", {
                    screen: "PropertyHome",
                  });
                }}
                labelStyle={{ fontSize: 18 }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons
                    name="person-outline"
                    size={24}
                    color="black"
                  />
                )}
                label="Profile"
                onPress={() => {
                  this.props.navigation.navigate("Profile");
                }}
                labelStyle={{ fontSize: 18 }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons name="location-on" size={24} color="black" />
                )}
                label="Visites Programmées"
                onPress={() => {
                  this.props.navigation.navigate("ScheduledVisit");
                }}
                labelStyle={{ fontSize: 18 }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons name="location-off" size={24} color="black" />
                )}
                label="Visites Effectuées"
                onPress={() => {
                  this.props.navigation.navigate("VisitDone");
                }}
                labelStyle={{ fontSize: 18 }}
              />
              {this.props.userType === "agent" ? (
                <>
                  <DrawerItem
                    icon={({ color, size }) => (
                      <MaterialIcons
                        name="location-city"
                        size={24}
                        color="black"
                      />
                    )}
                    label="Mes propriétés"
                    onPress={() => {
                      this.props.navigation.navigate("AgentProperty");
                    }}
                    labelStyle={{ fontSize: 18 }}
                  />
                  <DrawerItem
                    icon={({ color, size }) => (
                      <MaterialIcons
                        name="location-city"
                        size={24}
                        color="black"
                      />
                    )}
                    label="Ajouter une propriété"
                    onPress={() => {
                      this.props.navigation.navigate("AddProperty", {
                        property: {},
                        update: false,
                      });
                    }}
                    labelStyle={{ fontSize: 18 }}
                  />
                </>
              ) : null}
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons name="help-outline" size={24} color="black" />
                )}
                label="Support"
                onPress={() => {
                  this.props.navigation.navigate("Support");
                }}
                labelStyle={{ fontSize: 18 }}
              />
            </Drawer.Section>
            {/* <Drawer.Section title="Préferences">
              <TouchableRipple
                onPress={() => {
                  toggleTheme();
                }}
              >
                <View style={styles.preference}>
                  <Text style={{ fontSize: 18 }}>Dark Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={"dark"} />
                  </View>
                </View>
              </TouchableRipple>
            </Drawer.Section> */}
          </View>
        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Se déconnecter"
            onPress={() => {
              this.signOutUser();
            }}
          />
        </Drawer.Section>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userType: state.auth.userType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    marginTop: 15,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 17,
    lineHeight: 16,
    marginTop: 10,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
