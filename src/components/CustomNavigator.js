import React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";

const CustomNavImageSelection = ({
	text,
	border,
	onSuccess,
	backFunction,
	leftContent,
}) => {
	// do whatever you need with your props but just make sure to bind onSuccess to some button

	return (
		<View
			style={{
				backgroundColor: "gray",
				height: 45,
				width: "100%",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<TouchableOpacity
				style={{ width: 250 }}
				title={"V"}
				onPress={onSuccess}>
				<Text>{"Click here to Trigger onFinish func"}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default CustomNavImageSelection;
