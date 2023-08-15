import React, { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { useTheme, IconButton } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const formatCardNumber = (number) => {
  if (!number) {
    return "";
  }
  const formattedNumber = number.replace(/\s/g, "").match(/.{1,4}/g);
  return formattedNumber ? formattedNumber.join(" ") : "";
};

export default function CreditCard(props) {
  var [cardWidth, setCardWidth] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cvv, setCvv] = useState("");
  const [date, setDate] = useState("");
  const [viewCvv, setViewCvv] = useState("false");
  const [cardType, setCardType] = useState("");

  const theme = useTheme();
  const dimensions = useWindowDimensions();

  const cardTypeOptions = {
    VISA: require("../../assets/creditCard/visa_icon.png"),
    AMEX: require("../../assets/creditCard/amex_icon.png"),
    MASTER: require("../../assets/creditCard/mastercard_icon.png"),
    RUPAY: require("../../assets/creditCard/rupay_icon.png"),
  };

  useEffect(() => {
    setCardNumber(props.cardNumber || "1234567890123456");
    setNameOnCard(props.nameOnCard || "Christopher Nolan");
    setDate(props.date || "MM/YY");
    setCvv(props.cvv || "123");
    setCardType(props.cardType);
  }, [
    props.cardNumber,
    props.nameOnCard,
    props.date,
    props.cvv,
    props.cardType,
  ]);

  // console.log(cardType);

  useEffect(() => {
    setCardWidth(dimensions.width * 0.9);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(cardNumber);
  };

  const handleViewCvv = () => {
    setViewCvv(!viewCvv);
  };

  return (
    <SharedElement id={props.id} style={[StyleSheet.wrapper]}>
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
          source={require("../../assets/creditCard/nfc.png")}
          style={[styles.nfc, { tintColor: theme.colors.onPrimaryContainer }]}
        />
        <TouchableOpacity
          onPress={() => copyToClipboard()}
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            right: 10,
            top: 20,
          }}
        >
          <Image
            source={require("../../assets/creditCard/copy.png")}
            style={[
              styles.copy,
              {
                tintColor: theme.colors.onPrimaryContainer,
              },
            ]}
          />
        </TouchableOpacity>
        <View style={styles.titles}>
          <Text
            style={[
              styles.cardNumber,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {formatCardNumber(cardNumber)}
          </Text>
          <Text
            style={[
              styles.cardName,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {nameOnCard}
          </Text>
        </View>
        <View style={styles.dateCvv}>
          <View style={styles.dateContainer}>
            <Text
              style={{ fontSize: 16, color: theme.colors.onPrimaryContainer }}
            >
              Expiry date
            </Text>
            <Text
              style={[
                styles.dateField,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {date}
            </Text>
          </View>
          <View style={styles.cvvContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontSize: 16, color: theme.colors.onPrimaryContainer }}
              >
                CVV
              </Text>
              {viewCvv ? (
                <IconButton
                  icon="eye-off-outline"
                  iconColor={theme.colors.onPrimaryContainer}
                  size={20}
                  style={styles.hide}
                  onPress={handleViewCvv}
                />
              ) : (
                <IconButton
                  icon="eye"
                  iconColor={theme.colors.onPrimaryContainer}
                  size={20}
                  style={styles.hide}
                  onPress={handleViewCvv}
                />
              )}
            </View>
            {viewCvv ? (
              <Text
                style={[
                  styles.cvvField,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                ***
              </Text>
            ) : (
              <Text
                style={[
                  styles.cvvField,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {cvv}
              </Text>
            )}
          </View>
        </View>
        <Image source={cardTypeOptions[cardType]} style={styles.cardType} />
      </TouchableOpacity>
    </SharedElement>
  );
}

CreditCard.sharedElements = (route) => {
  return [{ id: props.id }];
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    top: 10,
    backgroundColor: "transparent",
  },
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
    lineHeight: 50,
    color: "#000",
    color: "white",
  },
  cardName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cardType: {
    width: 40,
    height: 24,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  copy: {
    width: 24,
    height: 24,
    zIndex: 999,
  },
  cvvField: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  dateCvv: {
    position: "absolute",
    flexDirection: "row",
    marginVertical: 0,
    bottom: 20,
    left: 20,
  },
  dateContainer: {
    marginRight: 20,
  },
  dateField: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  hide: {
    width: 20,
    height: 20,
    margin: 0,
    marginLeft: 10,
    tintColor: "white",
  },
  nfc: {
    width: 24,
    height: 24,
    position: "absolute",
    top: 20,
    left: 20,
    tintColor: "white",
  },
  titles: {
    color: "white",
    position: "absolute",
    marginTop: 20,
    marginLeft: 20,
    paddingBottom: 20,
  },
});
