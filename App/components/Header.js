import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import AppIcon from "../assets/icon.png";
import ProfileIcon from "../assets/profile.png";

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={AppIcon}
        style={{
          width: 30,
          height: 30,
        }}
      ></Image>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: "blue",
            fontSize: 24,
            fontWeight: "bold",
            paddingRight: 5,
          }}
        >
          e
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 2 }}>
          WALLET
        </Text>
      </View>
      <Image
        source={ProfileIcon}
        style={{
          width: 30,
          height: 30,
        }}
      ></Image>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
