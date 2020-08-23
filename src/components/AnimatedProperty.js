import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Property from "../components/Property";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  usePanGestureHandler,
  withDecay,
  diffClamp,
} from "react-native-redash";
import Animated, {
  interpolate,
  Extrapolate,
  add,
} from "react-native-reanimated";

const height = Dimensions.get("window").height;

const CARD_HEIGHT = 450;
const MARGIN = 16;
const HEIGHT = CARD_HEIGHT + MARGIN;

const Home = () => {
  const [containerHeight, setContainerHeight] = useState(height);
  const visibleProperty = Math.floor(containerHeight / HEIGHT);

  let properties = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const {
    gestureHandler,
    translation,
    velocity,
    state,
  } = usePanGestureHandler();
  const y = diffClamp(
    withDecay({
      value: translation.y,
      velocity: velocity.y,
      state,
    }),
    -HEIGHT * properties.length + visibleProperty * HEIGHT,
    0
  );
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        onLayout={({
          nativeEvent: {
            layout: { height: h },
          },
        }) => setContainerHeight(h)}
      >
        {properties.map((property, index) => {
          const positionY = add(y, index * HEIGHT);
          const isDesappearing = -HEIGHT;
          const isTop = 0;
          const isBottom = HEIGHT * (visibleProperty - 1);
          const isAppearing = HEIGHT * visibleProperty;
          const translateYWithScale = interpolate(positionY, {
            inputRange: [isBottom, isAppearing],
            outputRange: [0, -HEIGHT / 4],
            extrapolate: Extrapolate.CLAMP,
          });
          const translateY = add(
            interpolate(y, {
              inputRange: [-HEIGHT * index, 0],
              outputRange: [-HEIGHT * index, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
            translateYWithScale
          );
          const scale = interpolate(y, {
            inputRange: [isDesappearing, isTop, isBottom, isAppearing],
            outputRange: [0.5, 1, 1, 0.5],
            extrapolate: Extrapolate.CLAMP,
          });
          const opacity = interpolate(y, {
            inputRange: [isDesappearing, isTop, isBottom, isAppearing],
            outputRange: [0, 1, 1, 0],
            extrapolate: Extrapolate.CLAMP,
          });
          return (
            <Animated.View
              style={[
                styles.property,
                { opacity, transform: [{ translateY }, { scale }] },
              ]}
              key={property}
            >
              <Property />
            </Animated.View>
          );
        })}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Home;

const styles = StyleSheet.create({
  property: {
    marginVertical: MARGIN,
  },
});
