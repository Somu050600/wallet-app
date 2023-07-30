import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const DeleteIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name="trash-outline" size={24} color="red" />
    </TouchableOpacity>
  );
};

DeleteIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default DeleteIcon;
