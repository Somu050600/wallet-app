import { StyleSheet, Text, View, Image } from "react-native";

export default function Category(props) {
  return (
    <View style={styles.Container}>
      <View style={styles.imageBg} />
      <Image source={props.img_url} style={styles.image} />
      <Text style={styles.text}>{props.name}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  Container: {
    width: 75,
    height: 95,
    borderRadius: 38,
    marginHorizontal: 5,
  },
  image: {
    width: 75,
    height: 75,
  },
  imageBg: {
    position: "absolute",
    width: 74,
    height: 74,
    backgroundColor: "#e5e5e5",
    borderRadius: 37,
  },
  text: {
    position: "absolute",
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    color: "gray",
    alignSelf: "center",
    bottom: 0,
    fontWeight: "600",
  },
});
