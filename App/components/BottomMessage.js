import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const BottomMessage = ({ message }) => {
  return (
    <Animated.View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "rgba(250, 250, 250, 0.99)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    color: "#000",
    fontSize: 21,
  },
});

export default BottomMessage;
