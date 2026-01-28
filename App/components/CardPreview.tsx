import { StyleSheet, Text, View } from "react-native";

interface Card {
  brand?: string;
  name: string;
  last4: string;
  expiry: string;
}

interface CardPreviewProps {
  card: Card;
}

export function CardPreview({ card }: CardPreviewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.brand}>{card.brand || "Card"}</Text>
      <Text style={styles.number}>•••• •••• •••• {card.last4}</Text>
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
