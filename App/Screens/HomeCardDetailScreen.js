import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import Animated, { SharedTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardPreview } from "../components/CreditCardComponents/CardPreview";
import BackIcon from "../components/ExtraComponents/BackIcon";
import { shareCard } from "../utils/shareCard";

const cardSharedTransition = SharedTransition.duration(500);

const defaultBankLogo = require("../assets/bank_logos/default_bank.png");
const cardTypeOptions = {
  VISA: require("../assets/creditCard/visa_icon.png"),
  AMEX: require("../assets/creditCard/amex_icon.png"),
  MASTER: require("../assets/creditCard/mastercard_icon.png"),
  RUPAY: require("../assets/creditCard/rupay_icon.png"),
};
const bankLogos = {
  "State Bank of India": require("../assets/bank_logos/sbi.png"),
  "HDFC Bank": require("../assets/bank_logos/hdfc.png"),
  "ICICI Bank": require("../assets/bank_logos/icici.png"),
  "Axis Bank": require("../assets/bank_logos/axis.png"),
  "Kotak Mahindra Bank": require("../assets/bank_logos/kotak.png"),
  "City Union Bank": require("../assets/bank_logos/citi.png"),
  "SBM Bank": require("../assets/bank_logos/one_card.png"),
  HSBC: require("../assets/bank_logos/hsbc.png"),
};

function formatFullNumber(number) {
  if (!number) return "";
  const cleaned = String(number).replace(/\s/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
}

/**
 * Home card detail: full details, CVV toggle, share/edit/delete. SET via sharedTransitionTag.
 */
export default function HomeCardDetailScreen({ navigation }) {
  const route = useRoute();
  const theme = useTheme();
  const cardViewRef = useRef(null);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [sharing, setSharing] = useState(false);

  const card = route.params?.card;

  const sharePayload = card
    ? {
        brand: card.cardType || "Card",
        bankName: card.bankName || "",
        name: card.nameOnCard || "",
        cardNumber: card.cardNumber || "",
        expiry: card.date || "",
      }
    : null;

  const handleShare = async () => {
    if (!cardViewRef.current || !sharePayload) return;
    setSharing(true);
    try {
      await shareCard({ ref: cardViewRef, card: sharePayload });
    } catch (e) {
      Alert.alert("Share failed", e?.message ?? "Could not share.");
    } finally {
      setSharing(false);
    }
  };

  const handleShareWithAuth = async () => {
    if (sharing || !sharePayload) return;
    if (Platform.OS === "web") {
      handleShare();
      return;
    }
    try {
      const { success, error } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to share card details",
        cancelLabel: "Cancel",
      });
      if (success) {
        await handleShare();
      } else if (error === "not_enrolled" || error === "passcode_not_set") {
        await handleShare();
      } else if (error && error !== "user_cancel" && error !== "app_cancel") {
        Alert.alert(
          "Authentication required",
          "Set up device lock or biometrics to share card details securely.",
        );
      }
    } catch (e) {
      Alert.alert(
        "Authentication unavailable",
        e?.message ?? "Could not authenticate.",
      );
    }
  };

  const handleEdit = () => {
    navigation.navigate("CCInput", { card });
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this card?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const storedCards = await AsyncStorage.getItem("cards");
              if (storedCards) {
                const cardsArray = JSON.parse(storedCards);
                const cardIndex = cardsArray.findIndex((c) => c.id === card.id);
                if (cardIndex !== -1) {
                  cardsArray.splice(cardIndex, 1);
                  await AsyncStorage.setItem(
                    "cards",
                    JSON.stringify(cardsArray),
                  );
                  if (Platform.OS === "android") {
                    ToastAndroid.show(
                      "Card deleted successfully!",
                      ToastAndroid.SHORT,
                    );
                  }
                  navigation.goBack();
                } else {
                  Alert.alert("Error", "Card not found.");
                }
              } else {
                Alert.alert("Error", "No cards found.");
              }
            } catch (e) {
              Alert.alert("Error", e?.message ?? "Could not delete card.");
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  if (!card) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top", "left", "right"]}
      >
        <Text style={{ color: theme.colors.onSurface }}>No card data.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Back
        </Button>
      </SafeAreaView>
    );
  }

  const tag = `set-test-card-${String(card.id)}`;
  const cardBg = theme.colors.primaryContainer;
  const cardFg = theme.colors.onPrimaryContainer;
  const bankLogo = bankLogos[card?.bankName] || defaultBankLogo;
  const cardTypeIcon = cardTypeOptions[card?.cardType] || cardTypeOptions.VISA;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View
        ref={cardViewRef}
        collapsable={false}
        style={styles.hiddenShareView}
      >
        {sharePayload && <CardPreview card={sharePayload} />}
      </View>

      <View style={styles.header}>
        <BackIcon onPress={() => navigation.goBack()} />
      </View>

      <Animated.View
        sharedTransitionTag={tag}
        sharedTransitionStyle={cardSharedTransition}
        style={[styles.cardBox, { backgroundColor: cardBg }]}
      >
        <Image
          source={require("../assets/creditCard/nfc.png")}
          style={[styles.nfc, { tintColor: cardFg }]}
        />
        <Image
          source={cardTypeIcon}
          style={[styles.cardTypeIcon, { tintColor: cardFg }]}
          resizeMode="contain"
        />
        <View style={styles.topRow}>
          <Image
            source={bankLogo}
            style={[styles.bankIcon, { tintColor: cardFg }]}
            resizeMode="contain"
          />
          <Text style={[styles.bankName, { color: cardFg }]} numberOfLines={1}>
            {card?.bankName || "Card"}
          </Text>
        </View>
        <Text style={[styles.numberText, { color: cardFg }]} numberOfLines={1}>
          {formatFullNumber(card?.cardNumber)}
        </Text>
        <Text style={[styles.nameText, { color: cardFg }]} numberOfLines={1}>
          {card?.nameOnCard || ""}
        </Text>
        <Text style={[styles.expiry, { color: cardFg }]}>
          {card?.date ? `${card.date}` : ""}
        </Text>
        <View style={styles.cvvRow}>
          <Text style={[styles.cvvLabel, { color: cardFg }]}>CVV</Text>
          <Text style={[styles.cvvValue, { color: cardFg }]}>
            {cvvVisible ? card?.cvv || "***" : "***"}
          </Text>
          <IconButton
            icon={cvvVisible ? "eye-off" : "eye"}
            size={22}
            iconColor={cardFg}
            onPress={() => setCvvVisible((v) => !v)}
            style={styles.cvvEyeBtn}
          />
        </View>
      </Animated.View>

      <View style={styles.actionsRow}>
        <IconButton
          icon="share-variant"
          size={28}
          iconColor={theme.colors.onSurface}
          onPress={sharing ? undefined : handleShareWithAuth}
          style={styles.actionBtn}
        />
        <IconButton
          icon="pencil"
          size={28}
          iconColor={theme.colors.onSurface}
          onPress={handleEdit}
          style={styles.actionBtn}
        />
        <IconButton
          icon="delete-outline"
          size={28}
          iconColor={theme.colors.onSurface}
          onPress={handleDelete}
          style={styles.actionBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  hiddenShareView: {
    position: "absolute",
    left: -5000,
    top: 0,
  },
  header: {
    marginBottom: 20,
  },
  cardBox: {
    width: "100%",
    height: "auto",
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
  nfc: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
  },
  cardTypeIcon: {
    position: "absolute",
    bottom: 12,
    right: 16,
    width: 48,
    height: 34,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  bankIcon: {
    width: 28,
    height: 28,
    marginRight: 6,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  numberText: {
    fontSize: 24,
    letterSpacing: 1,
    marginTop: 12,
  },
  nameText: {
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 6,
  },
  cvvRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  cvvLabel: {
    fontSize: 18,
    marginRight: 8,
  },
  cvvValue: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 4,
  },
  cvvEyeBtn: {
    margin: 0,
    marginRight: -8,
  },
  expiry: {
    fontSize: 16,
    opacity: 0.9,
    marginTop: 12,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: -8,
  },
  actionBtn: {
    margin: 0,
  },
});
