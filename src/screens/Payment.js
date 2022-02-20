import React, { useState } from 'react';
import { StyleSheet, View, 
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Search from '../components/Searching';

const { height, width } = Dimensions.get('window');

export default function Payment({ route, navigation }) {

  const [uri , setUri] = useState(route.params.uri);
  const [isVisible , setIsVisible] = useState(true);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (!url) return;

    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      navigation.goBack();
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <WebView 
        style={styles.webview}
        originWhitelist={['*']}
        source={{ uri: uri }}
        onLoadEnd={() => setIsVisible(false)}
        onLoad={() => setIsVisible(false)}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      {isVisible && (
        <View style={styles.search}>
          <Search />
        </View>
      )}
      <View 
        style={{
        position: 'absolute',
        bottom: 30,
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  webview: {
    height: height/2,
    width: width
  },
});