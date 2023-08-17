import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddButton from "../components/AddButton";
import Cards from "../components/CreditCardComponents/Cards";
import Categories from "../components/CategoryComponents/Categories";
import NothingFound from "../components/ExtraComponents/NothingFound";

export default function HomeScreen(props) {
  const [nothing, setNothing] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const theme = useTheme();

  const route = useRoute();
  const cards = route.params?.cards;

  const CategoriesMemoized = React.memo(Categories);
  const CardsMemoized = React.memo(Cards);
  const NothingFoundMemoized = React.memo(NothingFound);

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  );

  const findCards = async () => {
    const result = await AsyncStorage.getItem("cards");
    if (result !== null) {
      setNothing(false);
    }
  };

  useLayoutEffect(() => {
    findCards();
  }, [cards]);

  useEffect(() => {
    if (refreshFlag) {
      // Fetch data or perform any actions needed
      setRefreshFlag(false); // Reset the refresh flag
    }
  }, [refreshFlag]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    findCards();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="auto" />
      {nothing ? (
        <NothingFoundMemoized />
      ) : (
        <ScrollView refreshControl={refreshControl}>
          <CategoriesMemoized />
          <CardsMemoized cards={cards} navigation={props.navigation} />
        </ScrollView>
      )}

      <AddButton navigation={props.navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    minHeight: "100%",
  },
});
