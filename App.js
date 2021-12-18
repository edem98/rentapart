import "react-native-gesture-handler";
import React from "react";
import App from "./RootApp";
// import redux to create the store
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./src/reducers/RootReducer";
// import redux and thunk
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whiteList: ["auth"],
};

// import {YellowBox} from 'react-native';
// YellowBox.ignoreWarnings(['useNativeDriver']);

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  compose(applyMiddleware(thunk.withExtraArgument()))
);

const persistor = persistStore(store);

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

export default AppWrapper;
