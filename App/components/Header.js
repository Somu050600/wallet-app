import * as Font from "expo-font";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SearchContext } from "../SearchContext";

const customFonts = {
  "Inter-Black": require("./../assets/Fonts/Borel-Regular.ttf"),
};

export default function Header(props) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const offsetValue = useRef(new Animated.Value(50)).current;

  const theme = useTheme();
  const onChangeSearch = (query) => setSearchQuery(query);

  const openSearch = () => {
    Animated.timing(offsetValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  const closeSearch = () => {
    Animated.timing(offsetValue, {
      toValue: 50,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isSearch) {
      openSearch();
    } else {
      closeSearch();
    }
  }, [isSearch]);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    })();
  }, []);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, top: insets.top },
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 0,
          margin: 0,
          justifyContent: "space-between",
          width: "100%",
          transform: [
            {
              translateY: offsetValue.interpolate({
                inputRange: [0, 50],
                outputRange: [-50, 0],
              }),
            },
            {
              rotateX: offsetValue.interpolate({
                inputRange: [0, 50],
                outputRange: ["80deg", "0deg"],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <IconButton icon="menu" onPress={props.onPress}></IconButton>
          {fontsLoaded ? (
            <Text
              style={{
                fontFamily: "Inter-Black",
                fontSize: 22,
                letterSpacing: 1,
                color: theme.colors.onBackground,
                padding: 0,
                margin: 0,
                includeFontPadding: false,
                transform: [{ translateY: 8 }],
              }}
            >
              ÒNEWallet
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                lineHeight: 24,
                letterSpacing: 2,
                color: theme.colors.background,
                padding: 0,
                margin: 0,
                includeFontPadding: false,
              }}
            >
              ÒNEWallet
            </Text>
          )}
        </View>
        <View flexDirection="row" alignItems="center">
          <IconButton
            size={24}
            icon="magnify"
            iconColor={theme.colors.onPrimary}
            style={{
              padding: 0,
              margin: 0,
              marginHorizontal: 10,
              backgroundColor: theme.colors.primary,
            }}
            onPress={() => setIsSearch(!isSearch)}
          />
          <IconButton
            size={24}
            icon="bell"
            iconColor={theme.colors.onPrimary}
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: theme.colors.primary,
            }}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.searchbarContainer,
          {
            width: dimensions.width,
            transform: [
              { translateY: offsetValue },
              {
                rotateX: offsetValue.interpolate({
                  inputRange: [0, 50],
                  outputRange: ["0deg", "80deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Searchbar
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
          traileringIcon="close"
          onTraileringIconPress={() => {
            setSearchQuery("");
            setIsSearch(!isSearch);
          }}
          onClearIconPress={() => {
            setSearchQuery("");
            setIsSearch(!isSearch);
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    height: 50,
    width: "100%",
    paddingLeft: 0,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
    overflow: "hidden",
  },
  searchbarContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  searchbar: {
    width: "95%",
    height: 50,
    padding: 0,
    margin: 0,
  },
});
