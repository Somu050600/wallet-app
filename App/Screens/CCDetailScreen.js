import React, { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { useTheme, IconButton, Button } from "react-native-paper";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { SharedElement } from "react-navigation-shared-element";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import BackIcon from "../components/ExtraComponents/BackIcon";

const formatCardNumber = (number) => {
  if (!number) {
    return "";
  }
  // const maskedNumber = number.replace(/^\d{12}/, "************");
  const formattedNumber = number.replace(/\s/g, "").match(/.{1,4}/g);
  return formattedNumber ? formattedNumber.join(" ") : "";
};

export default function CCDetailScreen(props) {
  var [cardWidth, setCardWidth] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardType, setCardType] = useState("");
  const [cvv, setCvv] = useState("");
  const [date, setDate] = useState("");
  const [viewCvv, setViewCvv] = useState("false");

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
    // setCardId(route.params?.card.id || null);
    setCardNumber(route.params?.card.cardNumber || "");
    setNameOnCard(route.params?.card.nameOnCard || "");
    setDate(route.params?.card.date || "");
    setCvv(route.params?.card.cvv || "");
    setCardType(route.params?.card.cardType);
  }, [route.params?.card]);

  useEffect(() => {
    setCardWidth(dimensions.width * 0.9);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(cardNumber);
  };

  const handleViewCvv = () => {
    setViewCvv(!viewCvv);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this card?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const storedCards = await AsyncStorage.getItem("cards");
              if (storedCards) {
                const cardsArray = JSON.parse(storedCards);
                const cardIndex = cardsArray.findIndex(
                  (card) => card.id === id
                );
                if (cardIndex !== -1) {
                  cardsArray.splice(cardIndex, 1);
                  await AsyncStorage.setItem(
                    "cards",
                    JSON.stringify(cardsArray)
                  );
                  // setCardDetails(cardsArray);
                  alert("Card deleted successfully!");
                  props.navigation.navigate("Home", { cards: cardsArray });
                } else {
                  alert("Card not found with the specified ID.");
                }
              } else {
                alert("No cards found in AsyncStorage.");
              }
            } catch (e) {
              alert("Error occurred while deleting the card: " + e);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView
      // style={{ backgroundColor: "black" }}
      style={{
        // marginTop: 40,
        width: dimensions.width,
        height: dimensions.height + 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          paddingHorizontal: 20,
          paddingVertical: 10,
          width: "100%",
          borderColor: theme.colors.primaryContainer,
          borderBottomWidth: 0.25,
        }}
      >
        <BackIcon onPress={() => props.navigation.goBack()} />
      </View>
      <SharedElement id={route.params?.card.id} style={[StyleSheet.wrapper]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onPress}
          style={[
            styles.container,
            {
              width: cardWidth,
              backgroundColor: theme.colors.onPrimaryContainer,
              borderWidth: 1,
              borderColor: theme.colors.onPrimaryContainer,
              overflow: "hidden",
              shadowColor: theme.colors.onPrimaryContainer,
              // backgroundColor: "black",
              transform: [
                { translateX: -cardWidth / 2 - 5 },
                { translateY: -104 },
              ],
            },
          ]}
        >
          <Image
            source={require("../assets/creditCard/nfc.png")}
            style={[styles.nfc, { tintColor: theme.colors.primaryContainer }]}
          />

          <Animatable.View
            animation={"fadeIn"}
            duration={700}
            delay={500}
            style={styles.dateCvv}
          >
            <View style={styles.dateContainer}>
              <Text
                style={{ fontSize: 16, color: theme.colors.primaryContainer }}
              >
                Expiry date
              </Text>
              <Text
                style={[
                  styles.dateField,
                  { color: theme.colors.primaryContainer },
                ]}
              >
                {date}
              </Text>
            </View>
            <View style={styles.cvvContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.primaryContainer,
                  }}
                >
                  CVV
                </Text>
                {viewCvv ? (
                  <IconButton
                    icon="eye-off-outline"
                    iconColor={theme.colors.primaryContainer}
                    size={20}
                    style={styles.hide}
                    onPress={handleViewCvv}
                  />
                ) : (
                  <IconButton
                    icon="eye"
                    iconColor={theme.colors.primaryContainer}
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
                    { color: theme.colors.primaryContainer },
                  ]}
                >
                  ***
                </Text>
              ) : (
                <Text
                  style={[
                    styles.cvvField,
                    { color: theme.colors.primaryContainer },
                  ]}
                >
                  {cvv}
                </Text>
              )}
            </View>
          </Animatable.View>
          {/* <SharedElement
            id={route.params?.card.cardName}
            style={styles.titlesContainer}
          > */}
          <Animatable.View
            animation={"fadeIn"}
            duration={700}
            delay={400}
            style={styles.titles}
          >
            <View
              style={{
                color: theme.colors.primaryContainer,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "black",
              }}
            >
              <Text
                style={[
                  styles.cardNumber,
                  { color: theme.colors.primaryContainer },
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
                      tintColor: theme.colors.primaryContainer,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.cardName,
                { color: theme.colors.primaryContainer },
              ]}
            >
              {nameOnCard}
            </Text>
          </Animatable.View>
          {/* </SharedElement> */}
          <Image source={cardTypeOptions[cardType]} style={styles.cardType} />
        </TouchableOpacity>
      </SharedElement>
      <Animatable.View
        duration={500}
        delay={700}
        animation={"fadeIn"}
        style={[styles.buttons, {}]}
      >
        <IconButton
          icon="pencil"
          size={32}
          style={{
            backgroundColor: theme.colors.primary,
          }}
          iconColor={theme.colors.onPrimary}
          onPress={() =>
            props.navigation.navigate("CCInput", { card: route.params?.card })
          }
        />
        {/* <IconButton
          icon="delete"
          size={32}
          style={{
            backgroundColor: "red",
          }}
          iconColor={theme.colors.onPrimary}
          onPress={() => handleDelete(route.params?.card.id)}
        /> */}
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            backgroundColor: "red",
            borderRadius: 25,
          }}
          onPress={() => handleDelete(route.params?.card.id)}
        >
          <LottieView
            autoPlay
            style={{
              width: 100,
              height: 100,
              // backgroundColor: theme.colors.background,
              transform: [{ translateX: -12.5 }, { translateY: -10 }],
            }}
            source={require("../assets/Lottie/delete_animation.json")}
          />
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

CCDetailScreen.sharedElements = (route) => {
  const card = route.params.card;
  return [{ id: card.id }];
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    top: 10,
    backgroundColor: "transparent",
  },
  container: {
    position: "absolute",
    top: "50%",
    // left: 0,
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
  buttons: {
    position: "absolute",
    transform: [{ translateY: 170 }],
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    width: 30,
    height: 30,
    position: "absolute",
    top: 20,
    right: 20,
    tintColor: "white",
  },
  titles: {
    color: "white",
    // position: "absolute",
    // marginTop: 20,
    // marginLeft: 20,
    // paddingBottom: 20,
    // bottom: 20,
    // left: -140,
  },
  titlesContainer: {
    color: "white",
    position: "absolute",
    marginTop: 20,
    marginLeft: 20,
    paddingBottom: 0,
    // bottom: 20,
    // backgroundColor: "black",
  },
});
