import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";

export default function Index({ navigation }) {
  const [index, setIndex] = useState(0);
  const [isMenu, setIsMenu] = useState(false);

  const MenuMemoized = React.memo(Menu);

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  const dimensions = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        { width: dimensions.width, height: dimensions.height },
      ]}
    >
      <Header onPress={handleMenu} />
      <MenuMemoized
        isMenu={isMenu}
        onPress={handleMenu}
        navigation={navigation}
        setIndex={setIndex}
        index={index}
      />
      <Navbar index={index} setIndex={setIndex} navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
});
