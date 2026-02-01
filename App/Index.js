import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Header from "./components/Header";
import HomeCardList from "./components/HomeCardList";
import Menu from "./components/Menu";
import ExploreScreen from "./Screens/ExploreScreen";
import SavedScreen from "./Screens/SavedScreen";
import ScanScreen from "./Screens/ScanScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import { SearchContext } from "./SearchContext";

export default function Index({ navigation }) {
  const [index, setIndex] = useState(0);
  const [isMenu, setIsMenu] = useState(false);
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dimensions = useWindowDimensions();

  const MenuMemoized = React.memo(Menu);

  const loadCards = useCallback(async () => {
    const raw = await AsyncStorage.getItem("cards");
    if (raw) setCards(JSON.parse(raw));
    else setCards([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards]),
  );

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <View
        style={[
          styles.container,
          { width: dimensions.width, height: dimensions.height },
        ]}
      >
        <Header onPress={handleMenu} />
        <MenuMemoized
          isMenu={isMenu}
          onPress={handleMenu}
          navigation={navigation}
          setIndex={setIndex}
          index={index}
        />
        {index === 0 && <HomeCardList navigation={navigation} cards={cards} />}
        {index === 1 && (
          <View style={styles.contentWrapper}>
            <ExploreScreen navigation={navigation} />
          </View>
        )}
        {index === 2 && (
          <View style={styles.contentWrapper}>
            <ScanScreen navigation={navigation} />
          </View>
        )}
        {index === 3 && (
          <View style={styles.contentWrapper}>
            <SavedScreen navigation={navigation} />
          </View>
        )}
        {index === 4 && (
          <View style={styles.contentWrapper}>
            <SettingsScreen navigation={navigation} />
          </View>
        )}
      </View>
    </SearchContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1 },
});
