import React from "react";
import { StatusBar, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

function StatusBarPlaceHolder() {
	//const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0
	const STATUS_BAR_HEIGHT = getStatusBarHeight();
	return (
		<View
			style={{
				width: "100%",
				height: STATUS_BAR_HEIGHT,
			}}>
			<StatusBar barStyle={"dark-content"} />
		</View>
	);
}

export default StatusBarPlaceHolder;
