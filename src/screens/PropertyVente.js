import React, {useState, useEffect, useCallback} from "react";
import {useFocusEffect} from '@react-navigation/native';
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Property from "../components/Property";
import Search from "../components/Searching";
import axios from "axios";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// Icon
import { Ionicons } from "@expo/vector-icons";
// Filter modal
import FilterModal from "../components/FilterModal";
// Import not find component
import NotFound from "../components/NotFound";
import { StatusBar } from "expo-status-bar";
import { useQuery } from 'react-query';
import API_CONFIG from "../config/constants";


const PropertyVente = ({ user, signIn, navigation }) => {

	const [next, setNext] = useState(null);
	const [url, setUrl] = useState(`${API_CONFIG.server_url}/api/property/list?status=A%20Vendre`);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState(null);


	const search = (params) => {
		setIsSearching(!isSearching);
		makeSearchRequest(params);
		setIsSearching(!isSearching);
	};

	const makeSearchRequest = async (params) => {
		const { address, region, minPrice, maxPrice, propertyType } = params;
		let requestUrl = `${API_CONFIG.server_url}/api/property/list?`;
		if (maxPrice !== Infinity && maxPrice !== NaN) {
			requestUrl += `maxprice=${parseInt(maxPrice)}&`;
		}
		if (minPrice !== 0 && minPrice !== NaN) {
			requestUrl += `minprice=${parseInt(minPrice)}&`;
		}
		if (address !== "" && address !== undefined) {
			requestUrl += `adresse=${address}&`;
		}
		if (region !== "" && region !== undefined) {
			requestUrl += `region=${region}&`;
		}
		if (propertyType !== "" && propertyType !== undefined) {
			requestUrl += `propertyType=${propertyType}&`;
		}

		const results  = await getProperties(requestUrl);
		navigation.push('ResultPage', { results });
	};

	const closeFilter = () => {
		setIsSearching(false);
	};

	const loadMore = () => {
		if (next != null) {
			getProperties(next);
		}
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
				setError(error.response.data);
				console.log(error);
			});

		if (data.next != null) {
			setNext(data.next);
		} else {
			setNext(null);
		}
		return data.results;
	};

	const { data, refetch, isLoading } = useQuery(
		["properties", url],
		() => getProperties(url)
	);

	useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);


	if (isLoading) {
		return (
			<Search />
		);
	}

	if (error) {
		console.log(error);
	}

	if (data && data.length === 0) {
		return (
			<NotFound 
				text='Aucune Propriété disponible'
				updateData={() => setUrl(`${API_CONFIG.server_url}/api/property/list?status=A%Vendre`)}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar
				style='dark'
				setStatusBarStyle={{ marginBottom: 50 }}
			/>
			<FlatList
				style={{ backgroundColor: "#fff" }}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				data={data}
				renderItem={({ item }) => (
					<Property
						property={item}
						navigation={navigation}
					/>
				)}
				onEndReached={loadMore}
				onEndReachedThreshold={0}
			/>
			{!isSearching ? (
				<TouchableOpacity
					style={styles.searchIconContainer}
					onPress={() => setIsSearching(true)}>
					<Ionicons
						name='ios-search'
						size={30}
						color='white'
						style={{
							marginLeft: 5,
							marginTop: 3,
							fontWeight: "bold",
						}}
					/>
				</TouchableOpacity>
			) : null}

			{isSearching === true ? (
				<FilterModal
					closeFilter={closeFilter}
					search={search}
				/>
			) : null}
		</View>
	);
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

export default connect(mapStateToProps, mapDispatchToProps)(PropertyVente);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
	searchIconContainer: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#5a86d8",
		zIndex: 1000,
		width: 55,
		height: 55,
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
		backgroundColor: "#fff",
	},
	noResult: {
		fontSize: 22,
		fontWeight: "400",
		marginRight: 10,
	},
});
