import { useRef } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardPreview } from "../components/CardPreview";
import { shareCard } from "../utils/shareCard";

import { useRoute } from "@react-navigation/native";

export default function ShareCardScreen() {
  const route = useRoute();
  const params = route.params as {
    card?: { brand: string; name: string; last4: string; expiry: string };
  };
  const card = params?.card || {
    brand: "Visa",
    name: "John Doe",
    last4: "1234",
    expiry: "08/27",
  };
  const ref = useRef(null);

  return (
    <SafeAreaView>
      <View ref={ref} collapsable={false}>
        <CardPreview card={card} />
      </View>
      <Button title="Share" onPress={() => shareCard({ ref, card })} />
    </SafeAreaView>
  );
}
