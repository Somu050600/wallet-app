import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useMemo } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Animated, { SharedTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchContext } from "../SearchContext";
import AddButton from "./AddButton";
import NothingFound from "./ExtraComponents/NothingFound";

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

function formatMaskedNumber(number) {
  if (!number) return "**** **** **** ****";
  const cleaned = String(number).replace(/\s/g, "");
  const last4 = cleaned.slice(-4);
  return `**** **** **** ${last4}`;
}

function cardMatchesSearch(card, query) {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();
  const fields = [
    card?.bankName ?? "",
    card?.cardType ?? "",
    String(card?.cardNumber ?? "").replace(/\s/g, ""),
    card?.nameOnCard ?? "",
    card?.date ?? "",
  ];
  return fields.some((f) => String(f).toLowerCase().includes(q));
}

async function copyMaskedNumber(masked) {
  await Clipboard.setStringAsync(masked);
  if (Platform.OS === "android") {
    ToastAndroid.show("Card number copied", ToastAndroid.SHORT);
  }
}

/**
 * Home card list with SET. Each card shows bank, type, masked number, expiry; tap navigates to HomeCardDetail.
 * Filters by SearchContext.searchQuery (bank name, card number, name, type, expiry).
 */
export default function HomeCardList({ navigation, cards }) {
  const theme = useTheme();
  const { searchQuery } = useContext(SearchContext);
  const filteredCards = useMemo(
    () => cards.filter((card) => cardMatchesSearch(card, searchQuery)),
    [cards, searchQuery],
  );
  const contentStyle = [
    styles.content,
    { backgroundColor: theme.colors.background },
  ];

  const cardBg = theme.colors.primaryContainer;
  const cardFg = theme.colors.onPrimaryContainer;

  return (
    <SafeAreaView style={contentStyle} edges={["top"]}>
      <StatusBar style="auto" />
      <View style={styles.section}>
        {filteredCards.length === 0 ? (
          <NothingFound />
        ) : (
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Cards
            </Text>
            {filteredCards.map((card) => {
              const tag = `set-test-card-${String(card.id)}`;
              const bankLogo = bankLogos[card?.bankName] || defaultBankLogo;
              const cardTypeIcon =
                cardTypeOptions[card?.cardType] || cardTypeOptions.VISA;
              return (
                <Pressable
                  key={card.id}
                  style={styles.cardItem}
                  onPress={() =>
                    navigation.navigate("HomeCardDetail", {
                      card,
                    })
                  }
                >
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
                      <Text
                        style={[styles.bankName, { color: cardFg }]}
                        numberOfLines={1}
                      >
                        {card?.bankName || "Card"}
                      </Text>
                    </View>
                    <View style={styles.numberRow}>
                      <Text
                        style={[styles.numberText, { color: cardFg }]}
                        numberOfLines={1}
                      >
                        {formatMaskedNumber(card?.cardNumber)}
                      </Text>
                      <IconButton
                        icon="content-copy"
                        size={20}
                        iconColor={cardFg}
                        onPress={() => copyMaskedNumber(card?.cardNumber)}
                        style={styles.copyBtn}
                      />
                    </View>
                    <Text style={[styles.expiry, { color: cardFg }]}>
                      {card?.date ? `${card.date}` : ""}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
      <AddButton navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 60,
    minHeight: "100%",
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardScroll: { flex: 1 },
  cardScrollContent: { paddingBottom: 20 },
  cardItem: {
    marginBottom: 16,
  },
  cardBox: {
    width: "100%",
    height: "auto",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
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
    width: 24,
    height: 24,
    marginRight: 6,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    gap: 10,
  },
  numberText: {
    fontSize: 20,
    letterSpacing: 1,
  },
  copyBtn: {
    margin: 0,
    marginRight: -8,
  },
  expiry: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
});
