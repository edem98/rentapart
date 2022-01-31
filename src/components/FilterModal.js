import React from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	View,
	Animated,
	TouchableOpacity,
} from "react-native";
// import auth action
import { signIn } from "../actions/authAction";
import { connect } from "react-redux";
// import utilities
import { Input } from "react-native-elements";
// Icon
import { FontAwesome, AntDesign } from "@expo/vector-icons";
// Import Dropdown
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class FilterModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minPrice: 0,
			maxPrice: 0,
			propertyType: "",
			adresse: "",
			region: "",
			translateY: new Animated.Value(0),
			opacity: new Animated.Value(0),
		};
	}

	componentDidMount() {
		Animated.timing(this.state.translateY, {
			toValue: -screenHeight,
			duration: 350,
			useNativeDriver: true,
		}).start();
	}

	unmount = () => {
		Animated.timing(this.state.translateY, {
			toValue: screenHeight,
			duration: 350,
			useNativeDriver: true,
		}).start();
		setTimeout(() => {
			this.props.closeFilter();
		}, 500);
		//this.props.closeFilter();
	};

	render() {
		return (
			<Animated.View
				style={[
					styles.container,
					{ transform: [{ translateY: this.state.translateY }] },
				]}>
				<View style={styles.filterZone}>
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
							{ label: "Villa simple", value: "Villa simple" },
							{ label: "Villa meublé", value: "Villa meublé" },
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
						defaultValue={this.state.propertyType}
						containerStyle={{
							height: 50,
							width: screenWidth - 80,
							marginBottom: 10,
							marginTop: 10,
						}}
						style={{ backgroundColor: "#fff" }}
						dropDownStyle={{
							backgroundColor: "#fff",
							justifyContent: "center",
							alignItems: "center",
							width: screenWidth - 80,
						}}
						dropDownMaxHeight={400}
						onChangeItem={(item) =>
							this.setState({
								propertyType: item.value,
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
							width: screenWidth - 80,
							marginBottom: 10,
							marginTop: 10,
						}}
						style={{ backgroundColor: "#fff" }}
						dropDownStyle={{
							backgroundColor: "#fff",
							justifyContent: "center",
							alignItems: "center",
							width: screenWidth - 80,
						}}
						dropDownMaxHeight={400}
						onChangeItem={(item) =>
							this.setState({
								region: item.value,
							})
						}
					/>
					<Input
						placeholder='Adresse'
						placeholderTextColor={"black"}
						inputStyle={styles.input}
						leftIcon={
							<FontAwesome
								name='money'
								size={30}
								color='#5a86d8'
							/>
						}
						containerStyle={styles.elementSpacing}
						onChangeText={(val) => {
							this.setState({
								adresse: val,
							});
						}}
					/>
					<Input
						placeholder='Prix maximum'
						placeholderTextColor={"black"}
						inputStyle={styles.input}
						leftIcon={
							<FontAwesome
								name='money'
								size={30}
								color='#5a86d8'
							/>
						}
						containerStyle={styles.elementSpacing}
						keyboardType={"numeric"}
						onChangeText={(val) => {
							this.setState({
								maxPrice: val,
							});
						}}
					/>
					<Input
						placeholder='Prix maximum'
						placeholderTextColor={"black"}
						inputStyle={styles.input}
						leftIcon={
							<FontAwesome
								name='money'
								size={30}
								color='#5a86d8'
							/>
						}
						containerStyle={styles.elementSpacing}
						keyboardType={"numeric"}
						onChangeText={(val) => {
							this.setState({
								maxPrice: val,
							});
						}}
					/>
					<TouchableOpacity
						onPress={() => this.props.search(this.state)}
						style={[styles.elementSpacing, styles.loginZone]}>
						<AntDesign name='search1' size={22} color='white' />
						<Text style={styles.loginText}>Rechercher</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.unmount}
						style={[styles.closeFilter]}>
						<AntDesign
							name='closecircleo'
							size={25}
							color='white'
						/>
					</TouchableOpacity>
				</View>
			</Animated.View>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		signIn: (user) => dispatch(signIn(user)),
	};
};

export default connect(null, mapDispatchToProps)(FilterModal);

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: screenHeight,
		left: 0,
		width: screenWidth,
		height: screenHeight,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2000,
	},
	filterZone: {
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 20,
		paddingHorizontal: 10,
		width: screenWidth - 50,
		overflow: "scroll",
		backgroundColor: "white",
		borderRadius: 15,
		marginTop: -60,
	},
	elementSpacing: {
		marginVertical: -7,
	},
	loginZone: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "white",
		backgroundColor: "#5a86d8",
		borderWidth: 1,
		paddingBottom: 10,
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 30,
		marginTop: 5,
	},
	closeFilter: {
		justifyContent: "center",
		alignItems: "center",
		borderColor: "white",
		backgroundColor: "red",
		borderWidth: 1,
		width: 40,
		height: 40,
		borderRadius: 25,
		marginTop: 20,
	},
	loginText: {
		fontSize: 18,
		color: "white",
		marginLeft: 10,
	},
	input: {
		color: "black",
		fontSize: 15,
	},
});
