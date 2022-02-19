import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import Property from "../components/PropertySwitch";
import axios from "axios";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// Not found and search component
import Search from "../components/Searching";
import NotFound from "../components/NotFound";
import { useQuery } from 'react-query';
import API_CONFIG from "../config/constants";

const AgentProperty = ({ user, navigation }) => {

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [next, setNext] = useState(null);
  const [url, setUrl] = useState(`${API_CONFIG.server_url}/api/property/agent-property-list`);

  useEffect(() => {
    getProperties(url);
  }, [url]);

  const loadMore = () => {
    if (next != null) {
      getProperties(next);
    }
  };

  const toogleProperty = (id, newProperties) => {
    newProperties.forEach((item) => {
      if (item.id === id) {
        updateDatabase(id);
      }
    });
  };

  const updateDatabase = async (id) => {
    // create request
    const api = axios.create({
      baseURL: `${API_CONFIG.server_url}/api/property/toggle-property-active/${id}`,
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });
    // send request and get back the agent in charge of the property
    await api
      .put(`/`)
      .then((res) => refetch())
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getProperties = async (url) => {
    const api = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });
    let data = await api
      .get("")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });

    if (data.next != null) {
      setNext(data.next);
    } else {
      setNext(null)
    }
    setIsloading(false);
    return data.results;
  };

  const { data, refetch } = useQuery(
		["agent-properties", url],
		() => getProperties(url)
	);

	useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);

  if (data && data.length === 0 && isLoading == true) {
    return <Search />;
  } else if (
    data && data.length == 0 &&
    isLoading == false
  ) {
    return <NotFound text="Aucune propriété ajoutée" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        renderItem={({ item }) => (
          <Property
            property={item}
            navigation={navigation}
            toogleProperty={() => toogleProperty(item.id, data)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

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
