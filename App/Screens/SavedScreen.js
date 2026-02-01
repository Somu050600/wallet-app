import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function SavedScreen(props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const size = Math.min(width, 320);

  return (
    <View
      style={[
        styles.animationContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <LottieView
        autoPlay
        style={{
          width: size,
          height: size,
          backgroundColor: theme.colors.background,
        }}
        source={require("../assets/Lottie/app_scrolling.json")}
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
