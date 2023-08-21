import { StyleSheet, Text, View, Image } from "react-native";
import { useTheme } from "react-native-paper";

export default function Category(props) {
  const theme = useTheme();
  return (
    <View style={styles.Container}>
      {/* <View
        style={[
          styles.imageBg,
          {
            backgroundColor:
              props.index === props.activeIndex
                ? theme.colors.primary
                : theme.colors.primaryContainer,
          },
        ]}
      /> 
      <Image source={props.img_url} style={styles.image} /> */}
      <Text
        style={[
          styles.text,
          {
            color:
              props.index === props.activeIndex
                ? theme.colors.primaryContainer
                : theme.colors.onPrimaryContainer,
            backgroundColor:
              props.index === props.activeIndex
                ? theme.colors.onPrimaryContainer
                : theme.colors.primaryContainer,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        {props.name}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  Container: {
    // width: 175,
    // height: 95,
    // borderRadius: 38,
    marginHorizontal: 5,
  },
  // image: {
  // width: 75,
  // height: 75,
  // },
  // imageBg: {
  //   position: "absolute",
  //   width: 74,
  //   height: 74,
  //   borderRadius: 37,
  // },
  text: {
    // position: "absolute",
    // width: "auto",
    // color: "#fff",
    fontSize: 12,
    // textAlign: "center",
    // color: "gray",
    // alignSelf: "center",
    // bottom: 0,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 0.25,
  },
});
