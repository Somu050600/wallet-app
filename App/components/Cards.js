import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import CreditCard from "./CreditCard";

export default function Cards() {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    setHeight(Dimensions.get("window").height);
    const width = Dimensions.get("window").width;
    setWidth(width);
    setCardWidth(width * 0.99);
  }, []);

  return (
    <View>
      <Text style={styles.cardTitle}>CARDS</Text>
      <ScrollView
        horizontal={true}
        decelerationRate="fast"
        snapToAlignment="center"
        snapToInterval={cardWidth - 22}
      >
        <View style={styles.creditCardContainer}>
          <CreditCard />
          <CreditCard />
          <CreditCard />
          <CreditCard />
          <CreditCard />
          <CreditCard />
          <CreditCard />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    letterSpacing: 0,
    color: "gray",
  },
  creditCardContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
});
