import { StyleSheet, Text, View, ScrollView } from "react-native";
import CreditCard from "./CreditCard";

export default function Cards() {
  return (
    <View>
      <Text style={styles.cardTitle}>CARDS</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.creditCardContainer}>
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
