import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function CardPreview({ card }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brand}>{card.brand || "Card"}</Text>
      <Text style={styles.number}>{card.cardNumber}</Text>
      <View style={styles.row}>
        <Text style={styles.small}>{card.name}</Text>
        <Text style={styles.small}>{card.expiry}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    height: 200,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#020617",
    justifyContent: "space-between",
  },
  brand: { color: "#fff", fontSize: 16 },
  number: { color: "#fff", fontSize: 20, letterSpacing: 2 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  small: { color: "#e5e7eb" },
});
