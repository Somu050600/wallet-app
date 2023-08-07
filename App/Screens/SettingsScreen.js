import React, { useState, useRef } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "react-native-paper";

export default function SettingsScreen(props) {
  const theme = useTheme();

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: theme.colors.background,
        }}
        source={require("../assets/Lottie/thanking_idea.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
