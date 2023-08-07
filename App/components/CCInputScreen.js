import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  // TextInput,
  KeyboardAvoidingView,
  Button,
  Pressable,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import CreditCard from "./CreditCard";
import BackIcon from "./BackIcon";
import DeleteIcon from "./DeleteIcon";
import BottomMessage from "./BottomMessage";
import { useTheme } from "react-native-paper";

export default function CCInputScreen({ navigation }) {
  const [cardDetails, setCardDetails] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardId, setCardId] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const inputRefs = useRef([]);
  const inputConfigs = [
    { maxLength: 16 },
    { maxLength: 21 },
    { maxLength: 7 },
    { maxLength: 4 },
  ];

  const theme = useTheme();
  const route = useRoute();

  useEffect(() => {
    setCardId(route.params?.id || null);
    setCardNumber(route.params?.cardNumber || "");
    setNameOnCard(route.params?.nameOnCard || "");
    setDate(route.params?.date || "");
    setCvv(route.params?.cvv || "");
  }, [route.params?.id]);

  const handleTextChange = (text, index) => {
    if (
      text.length >= inputConfigs[index].maxLength &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleInputChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCardNumber(numericValue);
  };
  const handleExpiryDate = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const limitedValue = numericValue.slice(0, 4);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    let formattedValue = limitedValue;
    // Check if MM is between 01 and 12
    if (limitedValue.length > 2) {
      const month = parseInt(limitedValue.slice(0, 2));
      if (month < 1) {
        formattedValue = "01";
      } else if (month > 12) {
        formattedValue = "12";
      } else {
        formattedValue =
          limitedValue.slice(0, 2) + " / " + limitedValue.slice(2);
      }
    }
    // Check if YY is greater than the current year
    if (limitedValue.length === 4) {
      const year = parseInt(limitedValue.slice(2));
      if (year < parseInt(currentYear)) {
        formattedValue = formattedValue.slice(0, 5) + currentYear;
      }
    }
    setDate(formattedValue);
  };

  const updateCard = async (cardId, updatedCardData) => {
    const updatedCardDetails = cardDetails.map((card) =>
      card.id === cardId ? { ...card, ...updatedCardData } : card
    );
    setCardDetails(updatedCardDetails);
    try {
      await AsyncStorage.setItem("cards", JSON.stringify(updatedCardDetails));
      console.log("Card details updated in AsyncStorage.");
      setTimeout(async () => {
        await navigation.navigate("Home", { cards: updatedCardDetails });
      }, 500);
    } catch (error) {
      console.log("Error updating card details in AsyncStorage:", error);
    }
  };

  const findCards = async () => {
    const result = await AsyncStorage.getItem("cards");
    // console.log(result);
    if (result !== null) {
      setCardDetails(JSON.parse(result));
      // console.log("fetched cards into CCInput");
    } else {
      console.log("failed to fetch cards into CCInput");
    }
  };

  useEffect(() => {
    findCards();
  }, []);

  const handleSave = async () => {
    if (cardNumber && nameOnCard && date && cvv) {
      const isCardExists = cardDetails.some(
        (existingCard) => existingCard.cardNumber === cardNumber
      );
      if (isCardExists) {
        alert("Card already exists! Try another Card");
      } else {
        const card = { id: cardNumber, cardNumber, nameOnCard, date, cvv };
        const updateCardDetails = [...cardDetails, card];
        setCardDetails(updateCardDetails);
        console.log(cardDetails, "handelSave");
        await AsyncStorage.setItem("cards", JSON.stringify(updateCardDetails));
        // await AsyncStorage.clear();
        await navigation.navigate("Home", { cards: updateCardDetails });
      }
    } else {
      alert("Please fill all fields");
    }
  };
  const handleCancel = () => {
    navigation.navigate("Home");
  };
  const handleUpdate = () => {
    const cardIdToUpdate = cardId;
    const updatedCardData = {
      cardNumber: cardNumber,
      nameOnCard: nameOnCard,
      date: date,
      cvv: cvv,
    };
    updateCard(cardIdToUpdate, updatedCardData);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
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
                  setCardDetails(cardsArray);
                  alert("Card deleted successfully!");
                  navigation.navigate("Home", { cards: cardsArray });
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.containerHeader}>
        <BackIcon onPress={handleCancel} />
        {cardId ? <DeleteIcon onPress={() => handleDelete(cardId)} /> : ""}
      </View>
      <ScrollView>
        <KeyboardAvoidingView
          width="100%"
          alignItems="center"
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust the offset value as needed
        >
          <View style={styles.creditCard}>
            <CreditCard
              cardNumber={cardNumber}
              nameOnCard={nameOnCard}
              date={date}
              cvv={cvv}
            />
          </View>

          <View style={styles.div}>
            <TextInput
              label={"Card Number"}
              mode="outlined"
              value={cardNumber}
              onChangeText={(text) => {
                handleInputChange(text);
                handleTextChange(text, 0);
              }}
              ref={(ref) => (inputRefs.current[0] = ref)}
              keyboardType="numeric"
              placeholder="_ _ _ _    _ _ _ _    _ _ _ _    _ _ _ _"
              maxLength={inputConfigs[0].maxLength}
              right={<TextInput.Affix text={cardNumber.length + "/16"} />}
            />
          </View>
          <View style={styles.div}>
            <TextInput
              label={"Name on Card"}
              mode="outlined"
              value={nameOnCard}
              onChangeText={(text) => {
                setNameOnCard(text);
                handleTextChange(text, 1);
              }}
              ref={(ref) => (inputRefs.current[1] = ref)}
              placeholder="card holder name"
              maxLength={21}
              right={<TextInput.Affix text={nameOnCard.length + "/21"} />}
            />
          </View>
          <View
            style={[
              styles.div,
              { flexDirection: "row", justifyContent: "space-around" },
            ]}
          >
            <View>
              <TextInput
                label={"Expiry Date"}
                mode="outlined"
                style={[styles.textInput, { width: 120, alignSelf: "center" }]}
                value={date}
                onChangeText={(text) => {
                  handleExpiryDate(text);
                  handleTextChange(text, 2);
                }}
                ref={(ref) => (inputRefs.current[2] = ref)}
                placeholder="MM / YY"
                placeholderTextColor="gray"
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
            <View>
              <TextInput
                label={"CVV"}
                mode="outlined"
                style={[
                  styles.textInput,
                  {
                    width: 120,
                    alignSelf: "center",
                  },
                ]}
                value={cvv}
                onChangeText={(text) => {
                  setCvv(text);
                  handleTextChange(text, 3);
                }}
                ref={(ref) => (inputRefs.current[3] = ref)}
                placeholder="123"
                placeholderTextColor="black"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.btn_container}>
          <Pressable style={styles.button1} onPress={() => handleCancel()}>
            <Text style={styles.btn_text}>Cancel</Text>
          </Pressable>
          {cardId ? (
            <Pressable style={styles.button2} onPress={() => handleUpdate()}>
              <Text style={styles.btn_text}>Update</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.button2}
              onPress={() => handleSave(cardId)}
            >
              <Text style={styles.btn_text}>Save</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
      {showMessage && (
        <BottomMessage message={"Card Updated!😎"} style={styles.bottom_msg} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn_container: {
    alignSelf: "center",
    marginTop: 30,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-around",
    // borderColor: "black",
    // borderWidth: 0.5,
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  button2: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2196F3",
  },
  btn_text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
  },
  bottom_msg: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  creditCard: {
    marginBottom: 25,
  },
  containerHeader: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  div: {
    width: "80%",
    paddingVertical: 10,
  },
  flex: {
    flex: 1,
    paddingTop: 10,
  },
  input_title: {
    fontSize: 12,
    fontWeight: 700,
    color: "gray",
  },
  saveBtn: {
    width: 100,
    backgroundColor: "#000",
  },
  scrollView: {
    position: "absolute",
  },
  // textInput: {
  //   width: "100%",
  //   // borderWidth: 1,
  //   borderColor: "#115599",
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 5,
  //   fontSize: 20,
  // },
});
