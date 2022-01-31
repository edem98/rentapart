import React from "react";
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

class PropertyHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phone: "",
			password: "",
			properties: [],
			isLoading: true,
			next: null,
			url: `https://www.alkebulan-immo.com/api/property/list`,
			isSearching: false,
			address: "",
		};
	}

	componentDidMount() {
		this.getProperties(this.state.url);
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			() => {
				this.getProperties(this.state.url);
			},
		);
	}

	componentWillUnmount() {
		this.willFocusSubscription();
	}

	search = (params) => {
		this.setState({
			isSearching: !this.state.isSearching,
		});
		this.makeSearchRequest(params);
		this.setState({
			isSearching: !this.state.isSearching,
		});
	};

	makeSearchRequest = (params) => {
		const { address, region, minPrice, maxPrice, propertyType } = params;
		let requestUrl = this.state.url + "?";
		if (maxPrice) {
			requestUrl += `maxprice=${maxPrice}&`;
		}
		if (minPrice) {
			requestUrl += `minprice=${minPrice}&`;
		}
		if (address) {
			requestUrl += `adresse=${address}&`;
		}
		if (region) {
			requestUrl += `region=${region}&`;
		}
		if (propertyType) {
			requestUrl += `propertyType=${propertyType}&`;
		}

		this.setState({
			properties: [],
		});

		this.getProperties(requestUrl);
	};

	closeFilter = () => {
		this.setState({
			isSearching: false,
		});
	};

	loadMore = () => {
		if (this.state.next != null) {
			this.getProperties(this.state.next);
		}
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
		if (
			this.state.properties.length === 0 &&
			this.state.isLoading == true
		) {
			return <Search />;
		} else if (
			this.state.properties.length == 0 &&
			this.state.isLoading == false
		) {
			return <NotFound text='Aucune Propriété disponible' />;
		} else {
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
						data={this.state.properties}
						renderItem={({ item }) => (
							<Property
								property={item}
								navigation={this.props.navigation}
							/>
						)}
						onEndReached={this.loadMore}
						onEndReachedThreshold={0}
					/>
					{!this.state.isSearching ? (
						<TouchableOpacity
							style={styles.searchIconContainer}
							onPress={this.search}>
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

					{this.state.isSearching === true ? (
						<FilterModal
							closeFilter={this.closeFilter}
							search={this.search}
						/>
					) : null}
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyHome);

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
