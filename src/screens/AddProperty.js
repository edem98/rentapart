import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
} from "react-native";
import axios from "axios";
import { Input } from "react-native-elements";
// Icon
import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import Loading component
import Loading from "../components/Loading";
// Import Dropdown
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class AddProperty extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			price: this.props.route.params.property.price
				? this.props.route.params.property.price
				: "",
			title: this.props.route.params.property.title
				? this.props.route.params.property.title
				: "",
			description: this.props.route.params.property.description
				? this.props.route.params.property.description
				: "",
			propertyType: this.props.route.params.property.type
				? this.props.route.params.property.type
				: "",
			status: this.props.route.params.property.status
				? this.props.route.params.property.status
				: "",
			region: this.props.route.params.property.district
				? this.props.route.params.property.district
				: "",
			mainImage: this.props.route.params.property.featured_image
				? this.props.route.params.property.featured_image
				: "https://picsum.photos/200/300",
			isAdding: false,
		};
	}

	componentDidMount() {
		this.getPropertyFeatures();
		this.getCities();
	}

	toogleCheck = (id) => {
		this.setState({
			propertiesFeature: this.state.propertiesFeature.map((item) =>
				item.id == id ? { ...item, checked: !item.checked } : item,
			),
		});
	};

	getPropertyFeatures = async () => {
		// extract property features if is an update
		const { property_features } = this.props.route.params.property
			? this.props.route.params.property
			: null;
		// create request
		const api = axios.create({
			baseURL: `https://www.alkebulan-immo.com/api/property/list-features/`,
			headers: {
				Authorization: `Token ${this.props.user.token}`,
			},
		});
		// send request and get back the property
		let propertiesFeature = await api
			.get(`/`)
			.then((res) => res.data)
			.catch((error) => {
				console.log(error.response.data);
			});
		if (propertiesFeature) {
			let features = [];
			if (property_features) {
				propertiesFeature.results.forEach((element) => {
					if (
						property_features.some((elt) => elt.id === element.id)
					) {
						features.push({
							name: element.name,
							checked: true,
							id: element.id,
						});
					} else {
						features.push({
							name: element.name,
							checked: false,
							id: element.id,
						});
					}
				});
			} else {
				propertiesFeature.results.forEach((element) => {
					features.push({
						name: element.name,
						checked: false,
						id: element.id,
					});
				});
			}
			this.setState({
				propertiesFeature: features,
			});
		} else {
			console.log("Aucune propriété associé");
		}
	};

	getCities = async () => {
		// create request
		const api = axios.create({
			baseURL: `https://www.alkebulan-immo.com/api/property/list-district/`,
			headers: {
				Authorization: `Token ${this.props.user.token}`,
			},
		});
		// send request and get back the property
		let districts = await api
			.get(`/`)
			.then((res) => res.data)
			.catch((error) => {
				console.log(error.response.data);
			});
		if (districts) {
			let formatedCities = [];
			districts.results.forEach((element) => {
				formatedCities.push({ label: element.name, value: element.id });
			});
			this.setState({
				districts: formatedCities,
			});
		} else {
			console.log("Aucun quariter associé");
		}
	};

	addProperty = () => {
		this.createProperty();
	};

	updateImage = (imageType, image) => {
		if (imageType == "main") {
			this.setState({
				mainImage: image,
			});
		} else if (imageType == "second") {
			this.setState({
				secondImage: image,
			});
		} else if (imageType == "third") {
			this.setState({
				thirdImage: image,
			});
		} else {
			return;
		}
	};

	getFile = async (url) => {
		const img_url = url;
		let result = await fetch(img_url);
		return result;
	};

	createProperty = async () => {
		// start showing loading component
		this.setState({
			isAdding: true,
		});

		const {
			price,
			description,
			title,
			propertyType,
			status,
			region,
			mainImage,
		} = this.state;

		// extract selected features
		let property_features = [];
		propertiesFeature.forEach((item) => {
			if (item.checked == true) {
				property_features.push(item.id);
			}
		});

		let form_data = new FormData();

		if (title) {
			form_data.append("title", title);
		}
		if (description) {
			form_data.append("description", description);
		}
		if (price) {
			form_data.append("price", price);
		}
		if (propertyType) {
			form_data.append("type", propertyType);
		}
		if (status) {
			form_data.append("status", status);
		}
		if (region) {
			form_data.append("district", region);
		}
		if (mainImage) {
			form_data.append("featured_image", {
				uri: mainImage,
				name: this.state.title + ".jpg",
				type: "jpeg",
			});
		}
		form_data.append("agent", this.props.user.id);
		// create request
		const api = axios.create({
			baseURL: `https://www.alkebulan-immo.com/api/property/create/`,
			headers: {
				Authorization: `Token ${this.props.user.token}`,
				"Content-Type": "multipart/form-data",
			},
		});

		// post or put request based on update state
		if (this.props.route.params.update) {
			form_data.append("id", this.props.route.params.property.id);
			await api
				.put(`/`, form_data)
				.then((res) => {
					Alert.alert(
						"SUCCÈS!!",
						"La propriété a été ajouter avec succès",
						[
							{
								text: "Fermer",
							},
						],
					);
				})
				.catch((error) => {
					Alert.alert(
						"ERREUR!!",
						"Une erreur s'est produite lors de l'ajout. \n Nous reglerons ce problème dans les plus bref délais",
						[
							{
								text: "Fermer",
							},
						],
					);
					console.log(error);
				});
		} else {
			await api
				.post(`/`, form_data)
				.then((res) => {
					Alert.alert(
						"SUCCÈS!!",
						"La propriété à été ajouter avec succès",
						[
							{
								text: "Fermer",
							},
						],
					);
				})
				.catch((error) => {
					alert(
						"Impossible de mettre à jour la propriété. Nous reglerons ce problème sous peu. Merci de votre patience",
					);
					console.log(error);
				});
		}
		this.setState({
			isAdding: false,
		});
	};

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				{this.state.isAdding ? (
					<Loading text='Enrégistrement en cours...' />
				) : (
					<View style={[styles.wrapper, styles.container]}>
						<TouchableOpacity
							style={styles.selectImages}
							onPress={() =>
								this.props.navigation.push("ImageBrowser")
							}>
							<Text style={styles.selectImagesText}>
								Ajouter des photos
							</Text>
						</TouchableOpacity>
						<DropDownPicker
							items={[
								{ label: "Studio", value: "Studio" },
								{
									label: "Appartement simple",
									value: "Appartement simple",
								},
								{
									label: "Appartement meublé",
									value: "Appartement meublé",
								},
								{
									label: "Villa simple",
									value: "Villa simple",
								},
								{
									label: "Villa meublé",
									value: "Villa meublé",
								},
								{ label: "Bureau", value: "Bureau" },
								{ label: "Terrain", value: "Terrain" },
								{ label: "Autres bien", value: "Autres bien" },
							]}
							placeholder='Type de bien'
							labelStyle={{
								fontSize: 17,
								color: "#000",
								fontWeight: "400",
							}}
							defaultValue={this.props.route.params.property.type}
							containerStyle={{
								height: 50,
								width: screenWidth - 40,
								marginVertical: 10,
							}}
							showArrowIcon={false}
							style={{ backgroundColor: "#fff" }}
							dropDownStyle={{
								backgroundColor: "#fff",
								justifyContent: "center",
								alignItems: "center",
								width: screenWidth - 40,
							}}
							dropDownMaxHeight={300}
							onChangeItem={(item) => {
								if (item.value == "Une pièce") {
									this.setState({
										propertyType: item.value,
										bedrooms: 1,
									});
								} else if (item.value == "Chambre Salon") {
									this.setState({
										propertyType: item.value,
										bedrooms: 2,
									});
								} else if (item.value == "2 chambres Salon") {
									this.setState({
										propertyType: item.value,
										bedrooms: 3,
									});
								} else {
									this.setState({
										propertyType: item.value,
									});
								}
							}}
						/>
						<DropDownPicker
							items={[
								{ label: "Location", value: "A Louer" },
								{ label: "Vente", value: "A Vendre" },
								{ label: "Baille", value: "A Bailler" },
								{ label: "Financement", value: "Financement" },
							]}
							placeholder='Titre (status du bien)'
							labelStyle={{
								fontSize: 17,
								color: "#000",
								fontWeight: "400",
							}}
							defaultValue={this.props.route.params.property.type}
							containerStyle={{
								height: 50,
								width: screenWidth - 40,
								marginVertical: 10,
							}}
							style={{ backgroundColor: "#fff" }}
							dropDownStyle={{
								backgroundColor: "#fff",
								justifyContent: "center",
								alignItems: "center",
								width: screenWidth - 40,
							}}
							dropDownMaxHeight={300}
							onChangeItem={(item) =>
								this.setState({
									status: item.value,
								})
							}
						/>
						<DropDownPicker
							items={[
								{ label: "Maritime", value: "Maritime" },
								{ label: "Plateaux", value: "Plateaux" },
								{ label: "Central", value: "Central" },
								{ label: "Kara", value: "Kara" },
								{ label: "Savanes", value: "Savanes" },
							]}
							placeholder='Region'
							labelStyle={{
								fontSize: 17,
								color: "#000",
								fontWeight: "400",
							}}
							defaultValue={this.state.region}
							containerStyle={{
								height: 50,
								width: screenWidth - 40,
							}}
							zIndex={10000}
							style={{ backgroundColor: "#fff" }}
							dropDownStyle={{
								backgroundColor: "#fff",
								justifyContent: "center",
								alignItems: "center",
								width: screenWidth - 40,
							}}
							dropDownMaxHeight={300}
							onChangeItem={(item) =>
								this.setState({
									region: item.value,
								})
							}
						/>
						<Input
							placeholder='Nom de la propriété'
							placeholderTextColor={"black"}
							inputStyle={{ color: "black", marginLeft: 5 }}
							leftIcon={
								<FontAwesome
									name='home'
									size={25}
									color='#5a86d8'
								/>
							}
							containerStyle={[
								styles.elementSpacing,
								{ marginTop: 5 },
							]}
							onChangeText={(val) => {
								this.setState({
									title: val,
								});
							}}
							defaultValue={this.state.title.toString()}
						/>
						<Input
							placeholder='Prix'
							placeholderTextColor={"black"}
							inputStyle={{
								color: "black",
								marginLeft: 5,
							}}
							leftIcon={
								<FontAwesome
									name='money'
									size={22}
									color='#5a86d8'
								/>
							}
							containerStyle={[
								styles.elementSpacing,
								{ marginTop: -15 },
							]}
							keyboardType={"numeric"}
							onChangeText={(val) => {
								this.setState({
									price: val,
								});
							}}
							defaultValue={this.state.price.toString()}
						/>
						<TextInput
							multiline
							placeholder='Description'
							style={styles.input}
							onChangeText={(text) =>
								this.setState({ description: text })
							}
						/>
						<TouchableOpacity
							style={[styles.elementSpacing, styles.loginZone]}
							onPress={this.addProperty}>
							<Ionicons
								name='ios-add-circle-outline'
								size={25}
								color='white'
								style={{ marginTop: 3 }}
							/>
							<Text style={styles.loginText}>
								{this.props.route.params.update
									? "Mettre à jour"
									: "Ajouter la propriété"}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddProperty);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	wrapper: {
		padding: 20,
		width: screenWidth,
		justifyContent: "center",
		alignItems: "center",
	},
	loginZone: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "blue",
		borderWidth: 1,
		paddingBottom: 10,
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 30,
		marginTop: 10,
		backgroundColor: "#203260",
	},
	elementSpacing: {
		marginVertical: 0,
	},
	loginText: {
		fontSize: 18,
		color: "white",
		marginLeft: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		padding: 10,
		marginBottom: 10,
		minHeight: 200,
		minWidth: "100%",
		textAlignVertical: "top",
		borderRadius: 10,
		backgroundColor: "#fafafa",
	},
	selectImages: {
		height: 130,
		width: "100%",
		borderColor: "#c9c9c9",
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	selectImagesText: {
		color: "#c9c9c9",
		fontSize: 14,
	},
});
