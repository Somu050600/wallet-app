import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import CardList from "./CardList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton, useTheme } from "react-native-paper";
import NothingFound from "../ExtraComponents/NothingFound";

export default function Cards(props) {
  const [cardWidth, setCardWidth] = useState(0);
  const [cards, setCards] = useState([]);
  const [sort, setSort] = useState(null);

  const theme = useTheme();
  const dimensions = useWindowDimensions();

  const findCards = async () => {
    const result = await AsyncStorage.getItem("cards");
    if (result !== null) {
      setCards(JSON.parse(result));
      // console.log(result);
    } else {
      console.log("failed to fetch cards");
    }
  };
  const findSort = async () => {
    const result = await AsyncStorage.getItem("cards-sort");
    if (result !== null) {
      setSort(JSON.parse(result));
      // console.log(JSON.parse(result, sort, "###"));
    } else {
      console.log("failed to fetch cards-sort");
    }
  };

  useEffect(() => {
    findCards();
  }, [props.cards]);

  useEffect(() => {
    setCardWidth(dimensions.width * 0.9);
    if (sort === null) {
      setSort(false);
    }
    findSort();
  }, []);

  const handleSaveSort = async (sort) => {
    setSort(sort);
    try {
      await AsyncStorage.setItem("cards-sort", JSON.stringify(sort));
      // await findSort();
      // console.log(sort);
    } catch {
      console.error();
    }
  };

  const handleCardPress = (card) => {
    props.navigation.navigate("CCScreen", { card });
    console.log("Card with ID:", card.id, "is pressed.");
  };

  const renderCreditCard = ({ item: card }) => (
    <CardList key={card.id} card={card} onPress={() => handleCardPress(card)} />
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
              onPress={() => handleSaveSort(!sort)}
              style={{
                padding: 0,
                margin: 0,
              }}
              size={18}
            />
          ) : (
            <IconButton
              icon="view-dashboard"
              onPress={() => handleSaveSort(!sort)}
              style={{
                padding: 0,
                margin: 0,
                backgroundColor: !sort ? theme.colors.secondaryContainer : "",
              }}
              size={18}
            />
          )}
          <IconButton
            icon="align-vertical-center"
            onPress={() => handleSaveSort(!sort)}
            style={{
              backgroundColor: sort
                ? theme.colors.secondaryContainer
                : theme.colors.background,
              padding: 0,
              margin: 0,
            }}
            size={18}
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
    fontSize: 18,
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
