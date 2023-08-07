import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Category from "./Category";
import { useState } from "react";

export default function Categories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [category, setCategory] = useState([
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
  ]);

  const handleCategoryClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <ScrollView
      style={styles.Container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {category.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => handleCategoryClick(index)}
          >
            <Category
              name={item.name}
              img_url={item.img_url}
              index={index}
              activeIndex={activeIndex}
            />
          </TouchableOpacity>
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
