import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import appConfig from "./app.json";
import Index from "./App/Index";
import CCInputScreen from "./App/Screens/CCInputScreen";
import HomeCardDetailScreen from "./App/Screens/HomeCardDetailScreen";
import LoginScreen from "./App/Screens/LoginScreen";
import { ThemeContext } from "./App/ThemeContext";

const Stack = createNativeStackNavigator();

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
      nativeControls={false}
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
    [colorScheme],
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
              initialRouteName="Main"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Main" component={Index} />
              <Stack.Screen
                name="HomeCardDetail"
                component={HomeCardDetailScreen}
                options={{ animation: "none" }}
              />
              <Stack.Screen
                name="CCInput"
                component={CCInputScreen}
                options={{
                  animation: "slide_from_bottom",
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
