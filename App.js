import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import {
  AppRegistry,
  useColorScheme,
  View,
  Image,
  useWindowDimensions,
  AppState,
  Dimensions,
  Button,
} from "react-native";
import { name as appName } from "./app.json";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import LoginScreen from "./App/Screens/LoginScreen";
import CCInputScreen from "./App/Screens/CCInputScreen";
import CCDetailScreen from "./App/Screens/CCDetailScreen";
import Index from "./App/Index";
import ExploreScreen from "./App/Screens/ExploreScreen";
import ScanScreen from "./App/Screens/ScanScreen";
import SavedScreen from "./App/Screens/SavedScreen";
import SettingsScreen from "./App/Screens/SettingsScreen";
import { useState, useLayoutEffect, useEffect } from "react";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createSharedElementStackNavigator();

export default function App(props) {
  const [themeColor, setThemeColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const theme1 = useTheme();

  const { width, height } = useWindowDimensions();

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
    return (
      <View style={{ flex: 1, backgroundColor: theme1.colors.background }}>
        <StatusBar style="auto" />
        <Video
          style={{ flex: 1 }}
          source={require("./App/assets/Video/logo_flow_2.mp4")}
          useNativeControls
          shouldPlay
          resizeMode={ResizeMode.COVER}
          isLooping="false"
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
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
    </PaperProvider>
  );
}
AppRegistry.registerComponent(appName, () => App);
