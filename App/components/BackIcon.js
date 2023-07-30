import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const BackIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="ios-arrow-back"
        size={24}
        style={styles.backIcon}
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
