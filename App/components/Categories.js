import { ScrollView, StyleSheet, Text, View } from "react-native";
import Category from "./Category";

export default function Categories() {
  const categoryJson = {
    category: [
      {
        name: "Credit Cards",
        img_url: require("../assets/Categories/credit-card.png"),
      },
      {
        name: "ID Cards",
        img_url: require("../assets/Categories/id-card.png"),
      },
      {
        name: "Gift Cards",
        img_url: require("../assets/Categories/gift-card.png"),
      },
      {
        name: "Loyalty Cards",
        img_url: require("../assets/Categories/loyalty-card.png"),
      },
      {
        name: "Access Cards",
        img_url: require("../assets/Categories/access-card.png"),
      },
    ],
  };
  return (
    <ScrollView
      style={styles.Container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {categoryJson.category.map((item, index) => {
        return (
          <Category name={item.name} img_url={item.img_url} key={item.name} />
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    // backgroundColor: "gray",
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
});
