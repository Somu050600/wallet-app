import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import LoginScreen from "./App/components/LoginScreen";
import HomeScreen from "./App/components/HomeScreen";
import CCInputScreen from "./App/components/CCInputScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar style="light" />
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
          <Stack.Screen name="Home" component={HomeScreen} />
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
  );
}
