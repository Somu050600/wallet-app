import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";

const BackIcon = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="ios-arrow-back"
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
