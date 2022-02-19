import React, { useState } from 'react';
import { StyleSheet, View,
  Dimensions, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Payment({ route, navigation }) {

  const [uri , setUri] = useState(route.params.uri);
  const [isVisible , setIsVisible] = useState(true);


  const handleWebViewNavigationStateChange = (newNavState) => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
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

  const renderLoadingView = () => {
    return (
      <ActivityIndicator
          animating = {this.state.visible}
          color = '#bc2b78'
          size = "large"
          style = {styles.activityIndicator}
          hidesWhenStopped={true} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView 
        onLoad={() => setIsVisible(false)}
        style={styles.container}
        originWhitelist={['*']}
        source={{ uri: uri }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      <View style={{
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
      {isVisible && (
        <ActivityIndicator
          style={{ position: "absolute", top: height / 3, left: (width / 2) - 30 }}
          size="large"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  webview: {
    height: '100%',
  },
});