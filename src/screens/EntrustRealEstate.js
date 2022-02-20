import React from "react";
import {
	StyleSheet,
	TextInput,
	Dimensions,
	TouchableOpacity,
	View,
	Text,
	Alert,
} from "react-native";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import auth action
import { signUp } from "../actions/authAction";
import { connect } from "react-redux";
// loading component
import Loading from "../components/Loading";
import API_CONFIG from "../config/constants";

const screenWidth = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


class EntrustRealEstate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			description: "",
			isLoading: false,
		};
	}

	isValidDescription = () => {
		const { description } = this.state;
		if (description.length === 0) {
			return false;
		}
		return true;
	};

	clearInput = () => {
		this.setState({
			description: "",
		});
	};

	sendDescription = async () => {
		this.setState({
			isLoading: true,
		});
		if (this.isValidDescription()) {
			let url =
				`${API_CONFIG.server_url}/api/operations/submit-property-request/`;
			// create request
			const api = axios.create({
				baseURL: url,
				headers: {
					Authorization: `Token ${this.props.user.token}`,
				},
			});
			const { description } = this.state;
			const data = {
				message: description,
				user: this.props.user.id,
				type: "Confier un bien",
				date_add: new Date(),
			};
			await api
				.post(`/`, data)
				.then((res) => {
					this.setState({
						description: "",
					})
					Alert.alert(
						"SUCCÈS!!",
						"Votre message à été mise à jour avec succès",
						[
							{
								text: "Fermer",
							},
						],
					);
				})
				.catch((error) => {
					alert(
						"Impossible de soumettre votre reqette.\n Nous reglerons ce problème dans les plus bref délais.",
					);
				});
		} else {
			alert("Veuillez entrer une description");
		}
		this.setState({
			isLoading: false,
		});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}>Description du Bien</Text>
				<TextInput
					multiline
					style={styles.input}
					onChangeText={(text) =>
						this.setState({ description: text })
					}
				/>
				<TouchableOpacity
					onPress={this.sendDescription}
					style={[styles.elementSpacing, styles.loginZone]}>
					<MaterialCommunityIcons
						name='send-circle-outline'
						size={30}
						color='white'
					/>
					<Text style={styles.loginText}>Envoyer la description</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		signUp: (user) => dispatch(signUp(user)),
	};
};

const mapStateToProps = (state) => {
	return {
		user: state.auth.user,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EntrustRealEstate);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignContent: "center",
		width: screenWidth,
		backgroundColor: "#fff",
		padding: 20,
	},
	headerText: {
		fontSize: 20,
		marginBottom: 10,
		textAlign: "left",
		marginLeft: 3,
		fontWeight: "bold",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		padding: 10,
		marginBottom: 10,
		minHeight: height * 0.7,
		minWidth: "100%",
		textAlignVertical: "top",
		borderRadius: 10,
		backgroundColor: "#fafafa",
	},
	buttonText: {
		fontSize: 20,
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
		backgroundColor: "#2C497F",
	},
	elementSpacing: {
		marginVertical: 5,
	},
	loginText: {
		fontSize: 17,
		color: "white",
		marginLeft: 15,
	},
});
