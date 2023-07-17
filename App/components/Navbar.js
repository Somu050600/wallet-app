import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import AddIcon from "../assets/Navbar/add.png";

export default function Navbar({ navigation }) {
  const [height, setHeight] = useState("0");
  const [width, setWidth] = useState("0");
  const [rotate, setRotate] = useState(new Animated.Value(0));
  const [isMenu, setIsMenu] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));

  const handleAdd = () => {
    const toValue = isMenu ? 0 : 225;

    Animated.spring(rotate, {
      toValue,
      friction: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(menuAnimation, {
      toValue: isMenu ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setIsMenu(!isMenu);
  };

  const handleInput = () => {
    navigation.navigate("CCInput");
  };

  useEffect(() => {
    setHeight(Dimensions.get("window").height);
    setWidth(Dimensions.get("window").width);
  }, []);

  const interpolatedRotate = rotate.interpolate({
    inputRange: [0, 225],
    outputRange: ["0deg", "225deg"],
  });

  const menuContainerStyles = [
    styles.menuContainer,
    {
      transform: [
        {
          translateY: menuAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.navbar]}>
        <TouchableWithoutFeedback onPress={handleAdd}>
          <Animated.Image
            source={AddIcon}
            style={[
              styles.imgicon,
              { transform: [{ rotate: interpolatedRotate }] },
            ]}
          />
        </TouchableWithoutFeedback>
        {isMenu && (
          <View style={styles.menu}>
            <Animated.Image source={AddIcon} style={styles.menuItem} />
            <Animated.Image source={AddIcon} style={styles.menuItem} />
            <TouchableWithoutFeedback onPress={() => handleInput()}>
              <Animated.Image source={AddIcon} style={styles.menuItem} />
            </TouchableWithoutFeedback>
            <Animated.Image source={AddIcon} style={styles.menuItem} />
            <Animated.Image source={AddIcon} style={styles.menuItem} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#f1f1f1",
    height: 100,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  imgicon: {
    width: 70,
    height: 70,
  },
  navbar: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    flexDirection: "row",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    position: "absolute",
    marginTop: 10,
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    top: -80,
  },
  menuItem: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});
