import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";

const formatCardNumber = (number) => {
  if (!number) {
    return "";
  }
  const formattedNumber = number.replace(/\s/g, "").match(/.{1,4}/g);
  return formattedNumber ? formattedNumber.join(" ") : "";
};

export default function CreditCard(props) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [cardWidth, setCardWidth] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [date, setDate] = useState("");
  const [viewCvv, setViewCvv] = useState("false");

  useEffect(() => {
    setCardNumber(props.cardNumber || "1234567890123456");
    setCardName(props.cardName || "Christopher Nolan");
    setDate(props.date || "MM/YY");
    setCvv(props.cvv || "123");
  }, [props.cardNumber, props.cardName, props.date, props.cvv]);

  useEffect(() => {
    setHeight(Dimensions.get("window").height);
    const width = Dimensions.get("window").width;
    setWidth(width);
    setCardWidth(width * 0.9);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(cardNumber);
  };

  const handleViewCvv = () => {
    setViewCvv(!viewCvv);
  };

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      <LinearGradient
        colors={["#0000ff", "#00d4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      />
      <Image
        source={require("../assets/creditCard/nfc.png")}
        style={styles.nfc}
      />
      <TouchableNativeFeedback onPress={copyToClipboard}>
        <Image
          source={require("../assets/creditCard/copy.png")}
          style={styles.copy}
        />
      </TouchableNativeFeedback>
      <View style={styles.titles}>
        <Text style={styles.cardNumber}>{formatCardNumber(cardNumber)}</Text>
        <Text style={styles.cardName}>{cardName}</Text>
      </View>
      <View style={styles.dateCvv}>
        <View style={styles.dateContainer}>
          <Text style={{ fontSize: 16, color: "white" }}>Expiry date</Text>
          <Text style={styles.dateField}>{date}</Text>
        </View>
        <View style={styles.cvvContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, color: "white" }}>CVV</Text>
            <TouchableNativeFeedback onPress={handleViewCvv}>
              {viewCvv ? (
                <Image
                  source={require("../assets/creditCard/unhide.png")}
                  style={styles.hide}
                />
              ) : (
                <Image
                  source={require("../assets/creditCard/hide.png")}
                  style={styles.hide}
                />
              )}
            </TouchableNativeFeedback>
          </View>
          {viewCvv ? (
            <Text style={styles.cvvField}>***</Text>
          ) : (
            <Text style={styles.cvvField}>{props.cvv}</Text>
          )}
        </View>
      </View>
      <Image
        source={require("../assets/creditCard/visa_icon.png")}
        style={styles.cardType}
      />
    </View>
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
    borderColor: "#00d4ff",
    // borderWidth: 1.5,
    height: 208,
    borderRadius: 11.5,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
    margin: 5,
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
    position: "absolute",
    top: 20,
    right: 20,
    tintColor: "white",
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
