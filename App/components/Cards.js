import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import CreditCard from "./CreditCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Cards(props) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [cardWidth, setCardWidth] = useState(0);
  const [cards, setCards] = useState([]);

  const findCards = async () => {
    const result = await AsyncStorage.getItem("cards");
    // console.log(result);
    if (result !== null) {
      setCards(JSON.parse(result));
      // console.log("fetched Cards");
    } else {
      console.log("failed to fetch cards");
    }
  };

  useEffect(() => {
    setHeight(Dimensions.get("window").height);
    setWidth(Dimensions.get("window").width);
  }, []);
  useEffect(() => {
    findCards();
  }, [props.cards]);

  useEffect(() => {
    setCardWidth(width * 0.9);
  }, [width]);

  const handleCardPress = (id, cardNumber, nameOnCard, date, cvv) => {
    props.navigation.navigate("CCInput", {
      id: id,
      cardNumber: cardNumber,
      nameOnCard: nameOnCard,
      date: date,
      cvv: cvv,
    });
    console.log("Card with ID:", id, "is pressed.");
  };

  return (
    <View>
      <Text style={styles.cardTitle}>CARDS</Text>
      {cards.length > 0 ? (
        <ScrollView
          horizontal={true}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={cardWidth + 10}
        >
          <View style={styles.creditCardContainer}>
            {cards.map((card) => (
              <CreditCard
                key={card.id}
                cardNumber={card.cardNumber}
                nameOnCard={card.nameOnCard}
                date={card.date}
                cvv={card.cvv}
                onPress={() =>
                  handleCardPress(
                    card.id,
                    card.cardNumber,
                    card.nameOnCard,
                    card.date,
                    card.cvv
                  )
                }
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.noCardsText}>No cards found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    letterSpacing: 0,
    color: "gray",
  },
  creditCardContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  noCardsText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});
