import React, { useRef, useState } from "react";
import { Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "react-native-paper";
import { Camera, CameraType, FlashMode } from "expo-camera";

export default function ScanScreen() {
  //   const animation = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [flashType, setFlashType] = useState(FlashMode.torch);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const theme = useTheme();

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    setFlashType((current) =>
      current === FlashMode.torch ? FlashMode.on : FlashMode.torch
    );
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          style={{
            width: "100%",
            // height: "100%",
            backgroundColor: theme.colors.background,
          }}
          source={require("../assets/Lottie/scanning.json")}
        />
        <Text
          style={[
            styles.text,
            {
              fontSize: 16,
              color: theme.colors.onBackground,
              paddingVertical: 10,
            },
          ]}
        >
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
