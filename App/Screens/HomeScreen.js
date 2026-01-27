import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "../components/AddButton";
import Categories from "../components/CategoryComponents/Categories";
import Cards from "../components/CreditCardComponents/Cards";
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

  const findCards = React.useCallback(async () => {
    const result = await AsyncStorage.getItem("cards");
    if (result !== null) {
      setNothing(false);
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    findCards();
    setTimeout(() => setRefreshing(false), 2000);
  }, [findCards]);

  useLayoutEffect(() => {
    findCards();
  }, [cards, findCards]);

  useEffect(() => {
    if (refreshFlag) {
      // Fetch data or any actions needed
      setRefreshFlag(false);
    }
  }, [refreshFlag]);

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="auto" />
      {nothing ? (
        <View
          style={[
            styles.nothingWrap,
            Platform.OS === "web" && styles.nothingWrapWeb,
          ]}
        >
          <NothingFoundMemoized />
        </View>
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
  nothingWrap: {
    flex: 1,
  },
  nothingWrapWeb: {
    flexShrink: 1,
    maxHeight: "80vh",
  },
});
