import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import {
  AppRegistry,
  useColorScheme,
  View,
  Image,
  useWindowDimensions,
  AppState,
  Dimensions,
} from "react-native";
import { name as appName } from "./app.json";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import LoginScreen from "./App/components/LoginScreen";
import CCInputScreen from "./App/components/CCInputScreen";
import Index from "./App/Index";
import Navbar from "./App/components/Navbar";
import ExploreScreen from "./App/Screens/ExploreScreen";
import ScanScreen from "./App/Screens/ScanScreen";
import SavedScreen from "./App/Screens/SavedScreen";
import SettingsScreen from "./App/Screens/SettingsScreen";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Video, ResizeMode, Audio, VideoFullscreenUpdateEvent } from "expo-av";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);

  // const dimensions = useWindowDimensions();
  const dimensions = Dimensions.get("window");

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const handlePlaybackStatusUpdate = (status) => {
    setStatus(status);
    if (status.didJustFinish) {
      video.current.pauseAsync();
    }
  };
  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // App is coming to the foreground, request audio focus
      await Audio.setAudioModeAsync({
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      });
    } else if (nextAppState === "background") {
      // App is going to the background, release audio focus
      await Audio.setAudioModeAsync({
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  useLayoutEffect(() => {
    (async () => {
      await video.current.loadAsync(
        require("./App/assets/Video/logo_flow.mp4"),
        {},
        false
      );
      setStatus(await video.current.getStatusAsync());
      await video.current.playAsync();
    })();
    setTimeout(() => {
      setIsLoading(false);
    }, 1700);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Video
          ref={video}
          style={{
            width: dimensions.width + 40,
            height: dimensions.height + 120,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        {/* <Image
          style={{ width: dimensions.width, height: dimensions.height + 40 }}
          source={require("./App/assets/Video/logo.gif")}
        /> */}
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
              headerStatusBarHeight: 5000,
              ...TransitionPresets.ModalTransition,
            })}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={Index} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
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
