import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

import Home from "./Home";

export default function App() {
  return (
    <LinearGradient colors={["#448AFF", "#FFEB3B"]} style={styles.container}>
      <Home />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});
