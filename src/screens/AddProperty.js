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
	Image,
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
// import ImageBrowser
import ImageBrowserPage from "../components/ImageBrowser";
import API_CONFIG from "../config/constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class AddProperty extends React.Component {
	constructor(props) {
		super(props);
		const { property } = this.props.route.params || {};
		this.state = {
			price: property?.price ? property?.price : "",
			address: property?.address ? property?.address : "",
			description: property?.description ? property?.description : "",
			propertyType: property?.type ? property?.type : "",
			status: property?.status ? property?.status : "",
			region: property?.region ? property?.region : "",
			isAdding: false,
			isOpen: false,
			photos: [],
		};
	}

	toogleCheck = (id) => {
		this.setState({
			propertiesFeature: this.state.propertiesFeature.map((item) =>
				item.id == id ? { ...item, checked: !item.checked } : item,
			),
		});
	};

	addProperty = () => {
		this.createProperty();
	};


	setImages(formData) {
		const { photos } = this.state;
		if (photos.length > 0) {
			formData.append("featured_image", photos[0]);
		}

		if (photos.length > 1) {
			for(let i = 1; i < photos.length; i++) {
				formData.append(`image${i+1}`, photos[i]);
			}
		}
		return formData;
	};

	clearState = () => {
		this.setState({
			price: "",
			address: "",
			description: "",
			propertyType: "",
			status: "",
			region: "",
			photos: [],
		});
	};

	componentDidMount(){
		console.log(this.props.user);
	}

	createProperty = async () => {
		// start showing loading component
		this.setState({
			isAdding: true,
		});

		const {
			price,
			description,
			address,
			propertyType,
			status,
			region,
		} = this.state;

		let form_data = new FormData();

		if (address) {
			form_data.append("address", address);
		}
		if (description) {
			form_data.append("description", description);
		}
		if (price) {
			form_data.append("price", price);
		}
		if (propertyType) {
			form_data.append("property_type", propertyType);
		}
		if (status) {
			form_data.append("status", status);
		}
		if (region) {
			form_data.append("region", region);
		}
		this.setImages(form_data);	
		form_data.append("agent", this.props.user.id);
		// create request
		const api = axios.create({
			baseURL: `${API_CONFIG.server_url}/api/property/create/`,
			headers: {
				Authorization: `Token ${this.props.user.token}`,
				"Content-Type": "multipart/form-data",
			},
		});

		// post or put request based on update state
		if (this.props.route.params?.update || false) {	
			form_data.append("id", this.props.route.params?.property?.id || "");
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
					console.log(error.message);
				});
		} else {
			await api
				.post(`/`, form_data)
				.then((res) => {
					this.clearState();
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
					console.log(error.message);
				});
		}
		this.setState({
			isAdding: false,
		});

	};

	onComplete = (photos) => {
    this.setState({
			photos,
			isOpen: false,
		});
  };

	deleteImage = (index) => {
		const { photos } = this.state;
		photos.splice(index, 1);
		this.setState({
			photos,
		});
	};

	render() {
		const { photos } = this.state;
		const { update } = this.props.route.params || false;
		if(this.state.isOpen) {
			return (
			<ImageBrowserPage 
				onComplete={this.onComplete} 
				close={() => this.setState({
					isOpen: false,
				})}
				oldPhotos={photos}
			/>
			);
		}
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				{this.state.isAdding && this.state.isOpen === false ? (
					<View style={{
						width: "100%",
						height: screenHeight,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: '#fff',
					}}>
					<Image source={require("../../assets/loading.gif")} resizeMode="center" />
				</View>
				) : (
					<View style={[styles.wrapper, styles.container]}>
						{this.state.photos.length > 0 ? (
							<>
							<View style={styles.imageContainer}>
								{this.state.photos.map((photo, index) => (
									<View style={{
										width: 100,
										height: 100,
										position: "relative",
									}}>
										<TouchableOpacity
											style={styles.closeWrapper}
											onPress={() => this.deleteImage(index)}
										>
											<Text style={styles.closeText}>x</Text>
										</TouchableOpacity>
										<Image source={{ uri: photo.uri }} style={styles.image} key={index} />
									</View>
								))}
							</View>
							<TouchableOpacity
								style={styles.addImage}
								onPress={() =>
								this.setState({
									isOpen: true,
								})}>
								<Text style={styles.text}>
									Selectionner ou ajouter d'autre images
								</Text>
							</TouchableOpacity>
							</>
						) : (
							<TouchableOpacity
							style={styles.selectImages}
							onPress={() =>
								this.setState({
									isOpen: true,
								})
							}>
							<>
								<Text style={styles.selectImagesText}>
									Ajouter des photos
								</Text>
							</>
						</TouchableOpacity>
						)}
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
						<DropDownPicker
							items={[
								{ label: "Location", value: "A Louer" },
								{ label: "Vente", value: "A Vendre" },
								{ label: "Baille", value: "A Bailler" },
							]}
							placeholder='Status du bien'
							labelStyle={{
								fontSize: 17,
								color: "#000",
								fontWeight: "400",
							}}
							defaultValue={this.state.status || ""}
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
						<Input
							placeholder='Type de bien'
							placeholderTextColor={"black"}
							inputStyle={{ color: "black", marginLeft: 5 }}
							leftIcon={
								<FontAwesome name="building-o" size={24} color="#5a86d8" />
							}
							containerStyle={[
								styles.elementSpacing,
								{ marginTop: 5 },
							]}
							onChangeText={(val) => {
								this.setState({
									propertyType: val,
								});
							}}
							defaultValue={this.state.propertyType.toString()}
						/>
						<Input
							placeholder='Quartier'
							placeholderTextColor={"black"}
							inputStyle={{ color: "black", marginLeft: 5 }}
							leftIcon={
								<Ionicons
									name='md-location-outline'
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
									address: val,
								});
							}}
							defaultValue={this.state.address.toString()}
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
							defaultValue={this.state.description.toString()}
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
								{update
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
	imageContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",
		width: "100%",
		padding: 10,
		borderWidth: 1,
		borderColor: "#c9c9c9",
		borderRadius: 10,
		marginBottom: 20,
	},
	image: {
		width: 100,
		height: 95,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	text: {
		width: "100%",
		textAlign: "center",
		fontSize: 14,
		color: "#fff",
	},
	addImage: {
		width: "100%",
		backgroundColor: "#203260",
		alignItems: "center",
		marginBottom: 20,
		padding: 10,
		borderRadius: 10,
	},
	closeWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		width: 20,
		height: 20,
		position: "absolute",
		top: 5,
		right: 5,
		color: "#fff",
		backgroundColor: "#5a86d8",
		zIndex: 10,
	},
	closeText: {
		color: "white",
		position: "absolute",
		top: -1,
		right: 5,
		fontSize: 16,
	}
});
