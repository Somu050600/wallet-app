import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { useTheme, Avatar, IconButton } from "react-native-paper";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

const customFonts = {
  "Inter-Black": require("./../assets/Fonts/Borel-Regular.ttf"),
};

export default function Header(props) {
  const theme = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    })();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <IconButton icon="menu" onPress={props.onPress}></IconButton>
        <View style={{ flexDirection: "row" }}>
          {fontsLoaded ? (
            <Text
              style={{
                fontFamily: "Inter-Black",
                fontSize: 22,
                letterSpacing: 1,
                color: theme.colors.onBackground,
                padding: 0,
                margin: 0,
              }}
            >
              ÒNEWallet
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
                color: theme.colors.background,
                padding: 0,
                margin: 0,
              }}
            >
              ÒNEWallet
            </Text>
          )}
        </View>
      </View>
      <Avatar.Icon size={32} icon="account" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    height: 50,
    width: "100%",
    paddingLeft: 0,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
});
