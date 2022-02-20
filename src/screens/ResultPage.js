import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import Property from "../components/Property";
// Import not find component
import NotFound from "../components/NotFound";
// Icon
import { Ionicons } from "@expo/vector-icons";
// Import not find component
import { StatusBar } from "expo-status-bar";

const ResultPage = ({ navigation, route }) => {
  const [results, setResults ] = useState([]);

	useEffect(() => {
    const { params } = route;
    setResults(params.results);
  }, [results]);

  if (results.length === 0) {
    return (
      <NotFound 
        text="Aucun résultat trouvé"
        updateData={() => navigation.goBack()}
      />
    );
  };

	return (
		<View style={styles.container}>
			<StatusBar
				style='dark'
				setStatusBarStyle={{ marginBottom: 50 }}
			/>
      <Text style={styles.resultText}>Résultats de la recheche</Text>
			<FlatList
				style={{ backgroundColor: "#fff" }}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				data={results}
				renderItem={({ item }) => (
					<Property
						property={item}
						navigation={navigation}
					/>
				)}
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
            onPress={() => navigation.goBack()}
          />
      </View>
		</View>
	);
};

export default ResultPage;

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
  resultText: {
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: '#5a86d8',
    paddingVertical: 10,
    color: 'white',
  }
});
