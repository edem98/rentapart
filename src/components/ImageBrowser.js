import React, { useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ImageBrowser } from "expo-image-picker-multiple";
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

export default function ImageBrowserPage({ onComplete, close, oldPhotos }) {
	const [header, setHeader] = useState();

	const _processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600, height: 600 } }],
      [{ compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }]
    );
    return file;
  };

	const imagesCallback = (callback) => {
		callback
			.then(async (photos) => {
				const cPhotos = [...oldPhotos];
				for (let photo of photos) {
					const pPhoto = await _processImageAsync(photo.uri);
					cPhotos.push({
						uri: pPhoto.uri,
						name: photo.filename.replace(/HEIC/g, 'jpg'),
						type: "image/jpg",
					});
					onComplete(cPhotos);
				}
			})
			.catch((e) => console.log(e));
	};



	const updateHandler = (count, onSubmit) => {
		setHeader(
			<>
			<View style={styles.header}>
				<Text style={styles.headerCountText}>
					{count} image(s) sélectionnée(s)
				</Text>
				<TouchableOpacity
					onPress={() => onSubmit()}
					style={styles.headerButton}>
					<Text style={styles.headerText}>Continuer</Text>
				</TouchableOpacity>
			</View>
			</>
		)
	};

	const renderSelectedComponent = (number) => (
		<View style={styles.countBadge}>
			<Text style={styles.countBadgeText}>{number}</Text>
		</View>
	);

	const emptyStayComponent = (
		<Text style={styles.emptyStay}>Aucune image disponible</Text>
	);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<View style={styles.container}>
					{header}
					<ImageBrowser
						max={10}
						onChange={updateHandler}
						callback={imagesCallback}
						renderSelectedComponent={renderSelectedComponent}
						emptyStayComponent={emptyStayComponent}
					/>
					<View style={{
						position: 'absolute',
						bottom: 20,
						right: 10,
						padding: 10,
						borderRadius: 50,
						backgroundColor: '#5a86d8',
					}}>
						<Ionicons
							name="arrow-back-outline"
							size={24} color="white"
							onPress={() => close()}
						/>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	emptyStay: {
		textAlign: "center",
	},
	countBadge: {
		paddingHorizontal: 8.6,
		paddingVertical: 5,
		borderRadius: 50,
		position: "absolute",
		right: 3,
		bottom: 3,
		justifyContent: "center",
		backgroundColor: "#0580FF",
	},
	countBadgeText: {
		fontWeight: "bold",
		alignSelf: "center",
		padding: "auto",
		color: "#ffffff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 50,
		width: "100%",
		paddingHorizontal: 10,
	},
	headerButton: {
		backgroundColor: "#0580FF",
		padding: 5,
		borderRadius: 5,
	},
	headerCountText: {
		fontSize: 15,
		color: "#000",
	},
	headerText: {
		color: "#ffffff",
	},
});
