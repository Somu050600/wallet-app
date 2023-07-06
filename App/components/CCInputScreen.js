import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { useState } from "react";
import CreditCard from "./CreditCard";
import { useNavigation } from "@react-navigation/native";

export default function CCInputScreen() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");

  const navigation = useNavigation();

  // const handleScroll = (event) => {
  //   const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
  //   const isScrolledToBottom =
  //     layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

  //   if (isScrolledToBottom) {
  //     navigation.goBack(); // Go back to the previous screen
  //   }
  // };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
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
              cardName={cardName}
              date={date}
              cvv={cvv}
              style={styles.creditCard}
            />
            <View style={styles.div}>
              <Text>Card Number</Text>
              <TextInput
                style={styles.textInput}
                value={cardNumber}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                placeholder="Card Number"
                placeholderTextColor="gray"
              />
            </View>
            <View style={styles.div}>
              <Text>Name on card</Text>
              <TextInput
                style={styles.textInput}
                value={cardName}
                onChangeText={setCardName}
                placeholder="Name on Card"
                placeholderTextColor="gray"
              />
            </View>
            <View
              style={[
                styles.div,
                { flexDirection: "row", justifyContent: "space-around" },
              ]}
            >
              <View>
                <Text>Expiry Date</Text>
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
                <Text>CVV</Text>
                <TextInput
                  style={styles.textInput}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  flex: {
    flex: 1,
    paddingTop: 1000,
  },
  container1: {
    position: "absolute",
    top: "-1000",
  },
  div: {
    width: "80%",
    paddingVertical: 10,
  },
  scrollView: {
    position: "absolute",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
