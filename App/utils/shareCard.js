import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";

export async function shareCard({ ref, card }) {
  try {
    const imageUri = await captureRef(ref, {
      format: "png",
      quality: 0.95,
      result: "tmpfile",
    });

    const message = `Card Details\nName: ${card.name}\nCard Number: ${card.cardNumber}\nExpiry: ${card.expiry}`;

    await Share.open({
      url: imageUri,
      message,
    });
  } catch (err) {
    const msg = err?.message ?? String(err);
    if (msg.includes("User did not share") || msg.includes("cancel")) {
      return;
    }
    throw err;
  }
}
