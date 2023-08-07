import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Drawer, useTheme } from "react-native-paper";
import LottieView from "lottie-react-native";
import * as Font from "expo-font";

const customFonts = {
  "Inter-Black": require("./../assets/Fonts/Borel-Regular.ttf"),
};

export default function Menu(props) {
  const [active, setActive] = useState("first");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const indexs = {
    0: "first",
    1: "fourth",
    3: "fifth",
    4: "sixth",
  };

  const theme = useTheme();

  const dimensions = useWindowDimensions();
  const offsetValue = useRef(new Animated.Value(-dimensions.width)).current;

  const openMenu = () => {
    Animated.timing(offsetValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  const closeMenu = () => {
    Animated.timing(offsetValue, {
      toValue: -dimensions.width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  useLayoutEffect(() => {
    setActive(indexs[props.index]);
  }, [props.index]);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (props.isMenu) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [props.isMenu]);

  return (
    <Animated.View
      style={[
        styles.Container,
        {
          height: dimensions.height + 40,
          transform: [{ translateX: offsetValue }],
          elevation: offsetValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300],
            extrapolate: "clamp",
          }),
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.backgroundContainer,
          {
            width: dimensions.width,
            height: dimensions.height + 40,
            right: -dimensions.width * 0.25,
          },
        ]}
        pressDuration={0}
        activeOpacity={1}
        onPress={props.onPress}
      ></TouchableOpacity>
      <View
        style={[
          styles.menuContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Drawer.Section title="">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <LottieView
              autoPlay
              style={{
                width: 60,
                // height: 50,
                backgroundColor: theme.colors.background,
                transform: [{ translateY: -4 }],
              }}
              source={require("../assets/Lottie/Wallet_Logo.json")}
            />
            {fontsLoaded ? (
              <Text
                style={{
                  fontFamily: "Inter-Black",
                  fontSize: 22,
                  letterSpacing: 1,
                  color: theme.colors.onBackground,
                  padding: 0,
                  margin: 0,
                }}
              >
                ÒNEWallet
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  color: theme.colors.onBackground,
                  padding: 0,
                  margin: 0,
                }}
              >
                ÒNEWallet
              </Text>
            )}
          </View>
          <Drawer.Item
            icon="home"
            label="Home"
            active={active === "first"}
            onPress={() => {
              setActive("first"), props.onPress(), props.setIndex(0);
            }}
          />
          <Drawer.Item
            icon="credit-card"
            label="Credit Cards"
            active={active === "second"}
            onPress={() => {
              setActive("second"), props.onPress();
            }}
          />
          <Drawer.Item
            icon="card-account-details"
            label="Id Cards"
            active={active === "third"}
            onPress={() => {
              setActive("third"), props.onPress();
            }}
          />
          <Drawer.Item
            icon="compass"
            label="Explore"
            active={active === "fourth"}
            onPress={() => {
              setActive("fourth"), props.onPress(), props.setIndex(1);
            }}
          />
          <Drawer.Item
            icon="bookmark"
            label="saved"
            active={active === "fifth"}
            onPress={() => {
              {
                setActive("fifth"), props.onPress(), props.setIndex(3);
              }
            }}
          />
          <Drawer.Item
            icon="cog"
            label="Settings"
            active={active === "sixth"}
            onPress={() => {
              setActive("sixth"), props.onPress(), props.setIndex(4);
            }}
          />
        </Drawer.Section>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  backgroundContainer: {
    position: "absolute",
    top: 0,
    zIndex: -1000,
  },
  Container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
    width: "75%",
  },
  menuContainer: {
    position: "absolute",
    paddingTop: 50,
    width: "100%",
    height: "100%",
    borderRadius: 30,
    elevation: 500,
  },
});
