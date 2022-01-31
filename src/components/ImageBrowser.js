import React, { useMemo } from "react";
import { Text, View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import StatusBarPlaceHolder from "./StatusBarPlaceholder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaType } from "expo-media-library";

const ForceInset = {
	top: "never",
	bottom: "never",
};

const _textStyle = {
	color: "white",
};

const _buttonStyle = {
	backgroundColor: "orange",
	borderRadius: 5,
};

const widgetErrors = {
	errorTextColor: "black",
	errorMessages: {
		hasErrorWithPermissions: "Please Allow media gallery permissions.",
		hasErrorWithLoading: "There was an error while loading images.",
		hasErrorWithResizing: "There was an error while loading images.",
		hasNoAssets: "No images found.",
	},
};

const widgetSettings = {
	getImageMetaData: false, // true might perform slower results but gives meta data and absolute path for ios users
	initialLoad: 100,
	assetsType: [MediaType.photo, MediaType.video],
	minSelection: 1,
	maxSelection: 10,
	portraitCols: 4,
};

const onSuccess = (data) => {
	Alert.alert("Done", data.length + "Images selected");
};

const widgetNavigator = {
	Texts: {
		finish: "finish",
		back: "back",
		selected: "selected",
	},
	midTextColor: "black",
	minSelection: 1,
	buttonTextStyle: _textStyle,
	buttonStyle: _buttonStyle,
	onBack: () => {},
	onSuccess: (e) => onSuccess(e),
};

const widgetStyles = {
	margin: 2,
	bgColor: "white",
	spinnerColor: "blue",
	widgetWidth: 99,
	videoIcon: {
		Component: Ionicons,
		iconName: "ios-videocam",
		color: "tomato",
		size: 20,
	},
	selectedIcon: {
		Component: Ionicons,
		iconName: "ios-checkmark-circle-outline",
		color: "white",
		bg: "#0eb14970",
		size: 26,
	},
};
// IOS users , make sure u can use the images uri to upload , if your getting invalid file path or u cant work with asset-library://
// Use = > getImageMetaData: true which will be little slower but give u also the absolute path of the Asset. just console loge the result to see the localUri

// See => https://docs.expo.dev/versions/latest/sdk/media-library/#assetinfo

export default function ImageBrowser() {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<StatusBarPlaceHolder />
				<View style={styles.container}>
					<AssetsSelector
						Settings={widgetSettings}
						Errors={widgetErrors}
						Styles={widgetStyles}
						Navigator={widgetNavigator}
						// Resize={widgetResize} know how to use first , perform slower results.
					/>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
