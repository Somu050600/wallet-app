import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import CreditCard from "./CreditCard";
import CardDetail from "./CardDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton, useTheme } from "react-native-paper";
import NothingFound from "../ExtraComponents/NothingFound";

export default function Cards(props) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [cardWidth, setCardWidth] = useState(0);
  const [cards, setCards] = useState([]);
  const [sort, setSort] = useState(false);

  const theme = useTheme();

  const findCards = async () => {
    const result = await AsyncStorage.getItem("cards");
    if (result !== null) {
      setCards(JSON.parse(result));
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
    props.navigation.push("CCInput", {
      id: id,
      cardNumber: cardNumber,
      nameOnCard: nameOnCard,
      date: date,
      cvv: cvv,
    });
    console.log("Card with ID:", id, "is pressed.");
  };

  const renderCreditCard = ({ item: card }) => (
    <CardDetail
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
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
        }}
      >
        <Text style={[styles.cardTitle, { color: theme.colors.secondary }]}>
          Credit Cards
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {sort ? (
            <IconButton
              icon="view-dashboard-outline"
              onPress={() => setSort(false)}
              style={{
                padding: 0,
                margin: 0,
              }}
            />
          ) : (
            <IconButton
              icon="view-dashboard"
              style={{
                padding: 0,
                margin: 0,
                backgroundColor: !sort ? theme.colors.secondaryContainer : "",
              }}
            />
          )}
          <IconButton
            icon="align-vertical-center"
            onPress={() => setSort(true)}
            style={{
              backgroundColor: sort
                ? theme.colors.secondaryContainer
                : theme.colors.background,
              padding: 0,
              margin: 0,
            }}
          />
        </View>
      </View>
      {cards.length > 0 ? (
        <FlatList
          data={cards}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={cardWidth + 10}
          renderItem={renderCreditCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.creditCardContainer,
            { flexDirection: sort ? "row" : "column" },
          ]}
        />
      ) : (
        <NothingFound />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingVertical: 5,
    letterSpacing: 0,
    color: "gray",
  },
  creditCardContainer: {
    paddingHorizontal: 13,
  },
  noCardsText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});
