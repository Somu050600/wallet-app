import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppRegistry,
  Platform,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import appConfig from "./app.json";
import { ThemeContext } from "./App/ThemeContext";
import Index from "./App/Index";
import CCDetailScreen from "./App/Screens/CCDetailScreen";
import CCInputScreen from "./App/Screens/CCInputScreen";
import ExploreScreen from "./App/Screens/ExploreScreen";
import LoginScreen from "./App/Screens/LoginScreen";
import SavedScreen from "./App/Screens/SavedScreen";
import ScanScreen from "./App/Screens/ScanScreen";
import SettingsScreen from "./App/Screens/SettingsScreen";

const Stack = createSharedElementStackNavigator();

function LoadingVideo() {
  const videoSource = require("./App/assets/Video/logo_flow_2.mp4");
  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = false;
    p.play();
  });
  return (
    <VideoView
      style={{ flex: 1 }}
      player={player}
      contentFit="cover"
      nativeControls
    />
  );
}

export default function App(props) {
  const [themeColor, setThemeColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const paperTheme =
    themeColor === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const findTheme = async () => {
    await AsyncStorage.getItem("theme-color").then((res) => {
      res === "System Default"
        ? setThemeColor(colorScheme)
        : setThemeColor(res);
    });
  };

  const setThemePreference = useCallback(
    (pref) => setThemeColor(pref === "System Default" ? colorScheme : pref),
    [colorScheme]
  );

  useEffect(() => {
    {
      findTheme();
      if (!themeColor && colorScheme) {
        setThemeColor(colorScheme);
      }
    }
  }, [colorScheme]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1700);
  }, []);

  if (isLoading) {
    const loadingBg = colorScheme === "dark" ? "#1a1a1a" : "#fff";
    return (
      <PaperProvider theme={paperTheme}>
        <View style={{ flex: 1, backgroundColor: loadingBg }}>
          <StatusBar style="auto" />
          {isWeb ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <LoadingVideo />
          )}
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeContext.Provider value={{ setThemePreference }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route, navigation }) => ({
              headerShown: false,
              gestureEnabled: true,
              cardOverlayEnabled: true,
              // headerStatusBarHeight: 5000,
              // ...TransitionPresets.ModalTransition,
            })}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={Index} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CCScreen" component={CCDetailScreen} />
            <Stack.Screen
              name="CCInput"
              component={CCInputScreen}
              options={{
                title: "CCInput",
                ...TransitionPresets.RevealFromBottomAndroid,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </ThemeContext.Provider>
    </PaperProvider>
  );
}
const appName = appConfig.expo?.name ?? "main";
AppRegistry.registerComponent(appName, () => App);
