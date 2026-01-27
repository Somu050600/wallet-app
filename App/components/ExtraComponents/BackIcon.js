import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

const BackIcon = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="arrow-back"
        size={24}
        style={[styles.backIcon, { color: theme.colors.onPrimaryContainer }]}
        color="black"
      />
    </TouchableOpacity>
  );
};

BackIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backIcon: {
    zIndex: 99,
  },
});

export default BackIcon;
