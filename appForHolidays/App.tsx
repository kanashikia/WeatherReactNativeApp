import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Home from "./Home";
import { createStackNavigator } from "react-navigation-stack";

export default class App extends React.Component {
  render() {
    return (
      <LinearGradient colors={["#448AFF", "#FFEB3B"]} style={styles.container}>
        <Home />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

const AppNavigator = createStackNavigator({
  HomeScreen: {
    screen: Home
  }
});
