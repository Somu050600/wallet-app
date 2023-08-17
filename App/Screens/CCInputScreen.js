import {
  StyleSheet,
  // Text,
  View,
  ScrollView,
  SafeAreaView,
  // TextInput,
  KeyboardAvoidingView,
  // Button,
  Pressable,
  Alert,
} from "react-native";
import {
  TextInput,
  RadioButton,
  List,
  Modal,
  Portal,
  Text,
  Button,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import CreditCard from "../components/CreditCardComponents/CreditCard";
import BackIcon from "../components/ExtraComponents/BackIcon";
import DeleteIcon from "../components/ExtraComponents/DeleteIcon";
import BottomMessage from "../components/ExtraComponents/BottomMessage";
import { useTheme } from "react-native-paper";
import { banks } from "../Configs/banks.json";

export default function CCInputScreen({ navigation }) {
  const [cardDetails, setCardDetails] = useState([]);
  const [bankName, setBankName] = useState("Bank Name");
  const [isCreditCard, setIsCreditCard] = useState("Card Type");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardId, setCardId] = useState("");
  const [cardType, setCardType] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isBank, setIsBank] = useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    borderRadius: 20,
    width: "80%",
    padding: 20,
    alignSelf: "center",
  };

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
    setCardId(route.params?.card.id || null);
    setBankName(route.params?.card.bankName || "Select a Bank");
    setIsCreditCard(route.params?.card.isCreditCard || "Card Type");
    setCardNumber(route.params?.card.cardNumber || "");
    setNameOnCard(route.params?.card.nameOnCard || "");
    setDate(route.params?.card.date || "");
    setCvv(route.params?.card.cvv || "");
    setCardType(route.params?.card.cardType || "");
  }, [route.params?.card]);

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
    setCardType(getCardType(numericValue));
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
      // console.log("Card details updated in AsyncStorage.");
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
    // setCardType(getCardType(cardNumber));
  }, []);

  function getCardType(number) {
    const numberFormated = number.replace(/\D/g, "");

    if (numberFormated.length < 4) {
      return undefined; // Cannot determine card type yet
    }

    if (/^4/.test(numberFormated)) {
      return "VISA";
    } else if (/^3/.test(numberFormated)) {
      return "AMEX";
    } else {
      var patterns = {
        MASTER: /^5[1-5][0-9]{14}$/,
        RUPAY: /^(508[5-9][0-9]{10})|(6069[8-9][0-9]{10})|(607[0-8][0-9]{10})$/,
      };
      for (var key in patterns) {
        if (patterns[key].test(numberFormated)) {
          return key;
        }
      }
    }
    return "VISA"; // Default to Visa if none of the conditions match
  }

  const handleSave = async () => {
    if (cardNumber.length == 16 && nameOnCard && date && cvv && cardType) {
      const isCardExists = cardDetails.some(
        (existingCard) => existingCard.cardNumber === cardNumber
      );
      if (isCardExists) {
        alert("Card already exists! Try another Card");
      } else {
        const card = {
          id: cardNumber,
          bankName: bankName,
          isCreditCard: isCreditCard,
          cardNumber: cardNumber,
          nameOnCard: nameOnCard,
          date: date,
          cvv: cvv,
          cardType: cardType,
        };
        const updateCardDetails = [...cardDetails, card];
        setCardDetails(updateCardDetails);
        await AsyncStorage.setItem("cards", JSON.stringify(updateCardDetails));
        // await console.log(cardDetails, "handelSave");
        // await AsyncStorage.clear();
        await navigation.navigate("Home", { cards: updateCardDetails });
      }
    } else if (cardNumber.length < 16) {
      alert("Please Enter 16 digits in Card Number");
    } else {
      alert("Please fill all fields");
    }
  };
  const handleCancel = () => {
    navigation.goBack();
  };
  const handleUpdate = () => {
    const cardIdToUpdate = cardId;
    const updatedCardData = {
      bankName: bankName,
      isCreditCard: isCreditCard,
      cardNumber: cardNumber,
      nameOnCard: nameOnCard,
      date: date,
      cvv: cvv,
      cardType: cardType,
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
              id={cardId}
              cardNumber={cardNumber}
              nameOnCard={nameOnCard}
              date={date}
              cvv={cvv}
              cardType={cardType}
            />
          </View>
          <View style={{ width: "80%", alignSelf: "center" }}>
            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={[
                  containerStyle,
                  {
                    backgroundColor: theme.colors.background,
                  },
                ]}
              >
                <ScrollView>
                  {isBank ? (
                    <List.Section title="Select a Bank Account">
                      {banks.map((bank) => {
                        return (
                          <List.Item
                            key={bank.key}
                            title={bank.name}
                            onPress={() => {
                              setBankName(bank.name);
                              hideModal();
                            }}
                          />
                        );
                      })}
                    </List.Section>
                  ) : (
                    <List.Section title="Select Card Type">
                      <List.Item
                        title="Credit card"
                        onPress={() => {
                          setIsCreditCard("Credit Card");
                          hideModal();
                        }}
                      />
                      <List.Item
                        title="Debit card"
                        onPress={() => {
                          setIsCreditCard("Debit Card");
                          hideModal();
                        }}
                      />
                    </List.Section>
                  )}
                </ScrollView>
              </Modal>
            </Portal>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Button
                style={{
                  width: "45%",
                  borderWidth: 1,
                  borderColor: theme.colors.onPrimaryContainer,
                  borderRadius: 4,
                }}
                onPress={() => {
                  setIsBank(true);
                  showModal();
                }}
              >
                {bankName}
              </Button>
              <Button
                style={{
                  width: "45%",
                  // backgroundColor: theme.colors.tertiaryContainer,
                  borderWidth: 1,
                  borderColor: theme.colors.onPrimaryContainer,
                  borderRadius: 4,
                  alignItems: "center",
                }}
                onPress={() => {
                  setIsBank(false);
                  showModal();
                }}
              >
                {isCreditCard}
              </Button>
            </View>
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
