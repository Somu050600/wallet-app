import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function CardPreview({ card }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>{card.brand || "Card"}</Text>
        {card.bankName ? (
          <Text style={styles.bankName} numberOfLines={1}>
            {card.bankName}
          </Text>
        ) : null}
      </View>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  brand: { color: "#fff", fontSize: 16 },
  bankName: { color: "#94a3b8", fontSize: 14 },
  number: { color: "#fff", fontSize: 20, letterSpacing: 2 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  small: { color: "#e5e7eb" },
});
