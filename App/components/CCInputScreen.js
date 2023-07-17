import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import CreditCard from "./CreditCard";

export default function CCInputScreen({ navigation }) {
  const [cardDetails, setCardDetails] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleInputChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCardNumber(numericValue);
  };
  const handleExpiryDate = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const prevValue = date.replace(/[^0-9]/g, "");
    const limitedValue = numericValue.slice(0, 4);

    let formattedValue = limitedValue;
    if (limitedValue.length > 2) {
      formattedValue = limitedValue.slice(0, 2) + " / " + limitedValue.slice(2);
    } else if (numericValue.length === 2 && prevValue.length !== 3) {
      formattedValue = numericValue + " / ";
    }

    setDate(formattedValue);
  };

  // const findCards = async () => {
  //   const result = await AsyncStorage.getItem("cards");
  //   console.log(result);
  //   if (result !== null) {
  //     setCardDetails(JSON.parse(result));
  //   }
  // };

  // useEffect(() => {
  //   findCards();
  // }, []);

  const handlesave = async () => {
    const card = { id: Date.now(), cardNumber, nameOnCard, date, cvv };
    if (cardNumber && nameOnCard && date && cvv) {
      const updateCardDetails = [...cardDetails, card];
      setCardDetails(updateCardDetails);
      await AsyncStorage.setItem("cards", JSON.stringify(updateCardDetails));
      await navigation.navigate("Home");
    } else {
      alert("Please fill all fields");
    }
  };
  const handleCancel = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView
          width="100%"
          alignItems="center"
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust the offset value as needed
        >
          <CreditCard
            cardNumber={cardNumber}
            cardName={nameOnCard}
            date={date}
            cvv={cvv}
            style={styles.creditCard}
          />
          <View style={styles.div}>
            <Text style={styles.input_title}>CARD NUMBER</Text>
            <TextInput
              style={styles.textInput}
              value={cardNumber}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder="_ _ _ _    _ _ _ _    _ _ _ _    _ _ _ _"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          <View style={styles.div}>
            <Text style={styles.input_title}>YOUR NAME</Text>
            <TextInput
              style={styles.textInput}
              value={nameOnCard}
              onChangeText={setNameOnCard}
              placeholder="card holder name"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          <View
            style={[
              styles.div,
              { flexDirection: "row", justifyContent: "space-around" },
            ]}
          >
            <View>
              <Text style={styles.input_title}>EXPIRY DATE</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={handleExpiryDate}
                placeholder="MM / YY"
                placeholderTextColor="gray"
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
            <View>
              <Text style={styles.input_title}>CVV</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { width: "150%", alignSelf: "center" },
                ]}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                placeholderTextColor="gray"
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
          <Pressable style={styles.button2} onPress={() => handlesave()}>
            <Text style={styles.btn_text}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  div: {
    width: "80%",
    paddingVertical: 10,
  },
  flex: {
    flex: 1,
    paddingTop: 0,
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
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#115599",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 20,
  },
});
