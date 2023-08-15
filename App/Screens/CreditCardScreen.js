import React, { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { useTheme, IconButton } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const formatCardNumber = (number) => {
  if (!number) {
    return "";
  }
  const maskedNumber = number.replace(/^\d{12}/, "************");
  const formattedNumber = maskedNumber.replace(/\s/g, "").match(/.{1,4}/g);
  return formattedNumber ? formattedNumber.join(" ") : "";
};

export default function CreditCardScreen(props) {
  var [cardWidth, setCardWidth] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardType, setCardType] = useState("");

  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const route = useRoute();

  const cardTypeOptions = {
    VISA: require("../assets/creditCard/visa_icon.png"),
    AMEX: require("../assets/creditCard/amex_icon.png"),
    MASTER: require("../assets/creditCard/mastercard_icon.png"),
    RUPAY: require("../assets/creditCard/rupay_icon.png"),
  };

  useEffect(() => {
    // setCardId(route.params?.id || null);
    setCardNumber(route.params?.cardNumber || "");
    setNameOnCard(route.params?.nameOnCard || "");
    // setDate(route.params?.date || "");
    // setCvv(route.params?.cvv || "");
  }, [route.params?.id]);

  useEffect(() => {
    setCardWidth(dimensions.width * 0.9);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(cardNumber);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[
        styles.container,
        {
          width: cardWidth,
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.onPrimaryContainer,
          overflow: "hidden",
          shadowColor: theme.colors.onPrimaryContainer,
        },
      ]}
    >
      <Image
        source={require("../assets/creditCard/nfc.png")}
        style={[styles.nfc, { tintColor: theme.colors.onPrimaryContainer }]}
      />

      <View style={styles.titles}>
        <View
          style={{
            color: theme.colors.onPrimaryContainer,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "black",
          }}
        >
          <Text
            style={[
              styles.cardNumber,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {formatCardNumber(cardNumber)}
          </Text>
          <TouchableOpacity onPress={() => copyToClipboard()}>
            <Image
              source={require("../assets/creditCard/copy.png")}
              style={[
                styles.copy,
                {
                  tintColor: theme.colors.onPrimaryContainer,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[styles.cardName, { color: theme.colors.onPrimaryContainer }]}
        >
          {nameOnCard}
        </Text>
      </View>
      <Image source={cardTypeOptions[cardType]} style={styles.cardType} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 205,
    borderRadius: 10,
  },
  container: {
    position: "relative",
    // borderWidth: 0.5,
    height: 208,
    borderRadius: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
    marginHorizontal: 5,
    marginVertical: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    // opacity: 0.5,
    // blurRadius: 100,
  },
  cardNumber: {
    fontSize: 26,
    fontWeight: "bold",
    // lineHeight: 50,
    color: "#000",
    color: "white",
    alignItems: "center",
    flexDirection: "row",
  },
  cardName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cardType: {
    width: 70,
    height: 50,
    position: "absolute",
    top: 10,
    left: 20,
  },
  copy: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  nfc: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 20,
    right: 20,
    tintColor: "white",
  },
  titles: {
    color: "white",
    position: "absolute",
    marginTop: 20,
    marginLeft: 20,
    paddingBottom: 0,
    bottom: 20,
  },
});
