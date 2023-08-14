import React, { useRef, useEffect } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "react-native-paper";

export default function NothingFound() {
  const animation = useRef(null);

  const theme = useTheme();

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: theme.colors.background,
        }}
        source={require("../../assets/Lottie/nothing_found.json")}
      />
      <View style={styles.buttonContainer}>
        <Text
          style={[
            styles.textContainer,
            {
              fontSize: 16,
              color: theme.colors.onBackground,
              paddingVertical: 10,
            },
          ]}
        >
          Nothing found, Please add a Card!
        </Text>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 35,
            // height: "100%",
            backgroundColor: theme.colors.background,
          }}
          source={require("../../assets/Lottie/animated_add_button.json")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  textContainer: {
    fontSize: 24,
    fontWeight: 700,
  },
});
