import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import Header from "./Header";
import Navbar from "./Navbar";
import Cards from "./Cards";
import Categories from "./Categories";
import { useRoute } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const route = useRoute();
  const cards = route.params?.cards;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      navigation.navigate("Home");
    }, 2000);
  }, []);

  useEffect(() => {
    setHeight(Dimensions.get("window").height);
    setWidth(Dimensions.get("window").width);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Cards cards={cards} navigation={navigation} />
        <Categories />
      </ScrollView>
      <Navbar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
});
