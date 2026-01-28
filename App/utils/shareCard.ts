import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";

interface Card {
  brand?: string;
  name: string;
  last4: string;
  expiry: string;
}

interface ShareCardParams {
  ref: any;
  card: Card;
}

export async function shareCard({ ref, card }: ShareCardParams) {
  const imageUri = await captureRef(ref, { format: "png", quality: 0.95 });

  const message = `Card Details\nName: ${card.name}\nLast 4: ${card.last4}\nExpiry: ${card.expiry}`;

  await Share.open({
    url: imageUri,
    message,
  });
}
