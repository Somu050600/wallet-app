import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

const isWeb = Platform.OS === "web";

export default function NothingFound() {
  const animation = useRef(null);

  const theme = useTheme();

  return (
    <View
      style={[styles.animationContainer, isWeb && styles.animationContainerWeb]}
    >
      <View style={isWeb ? styles.lottieWrapWeb : undefined}>
        <LottieView
          autoPlay
          ref={animation}
          style={[
            styles.lottieMain,
            { backgroundColor: theme.colors.background },
          ]}
          source={require("../../assets/Lottie/nothing_found.json")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Text
          style={[
            styles.textContainer,
            {
              color: theme.colors.onBackground,
            },
          ]}
        >
          Nothing found, Please add a Card!
        </Text>
        <LottieView
          autoPlay
          ref={animation}
          style={[
            styles.lottieButton,
            { backgroundColor: theme.colors.background },
          ]}
          source={require("../../assets/Lottie/animated_add_button.json")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainerWeb: {
    flex: 1,
    flexShrink: 1,
    maxHeight: 420,
  },
  lottieWrapWeb: {
    width: 280,
    height: 280,
  },
  lottieMain: {
    width: 280,
    height: 280,
    maxWidth: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  textContainer: {
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
  },
  lottieButton: {
    width: 35,
    height: 35,
  },
});
