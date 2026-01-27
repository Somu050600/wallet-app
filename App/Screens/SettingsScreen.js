import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import {
  List,
  Modal,
  Portal,
  Switch,
  useTheme,
  Button,
} from "react-native-paper";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../ThemeContext";

export default function SettingsScreen(props) {
  const [themeColor, setThemeColor] = useState("System Default");
  const [visible, setVisible] = useState(false);
  const { setThemePreference } = useContext(ThemeContext);
  const theme = useTheme();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleTheme = async (e) => {
    setThemeColor(e);
    await AsyncStorage.setItem("theme-color", e);
    setThemePreference?.(e);
  };

  const findTheme = async () => {
    await AsyncStorage.getItem("theme-color").then((res) => {
      res === "System Default" || res === undefined
        ? setThemeColor("System Default")
        : setThemeColor(res);
    });
  };

  useEffect(() => {
    findTheme();
  }, []);
  return (
    <View style={styles.animationContainer}>
      <View
        style={{
          borderWidth: 0.5,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: theme.colors.onPrimary,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.onPrimaryContainer,
          }}
        >
          Choose Theme
        </Text>
        <View>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={[
                {
                  width: "80%",
                  backgroundColor: theme.colors.background,
                  alignSelf: "center",
                  borderRadius: 10,
                  padding: 10,
                },
              ]}
            >
              <ScrollView>
                <List.Section>
                  <List.Item
                    title={"System Default"}
                    onPress={() => {
                      handleTheme("System Default");
                      hideModal();
                    }}
                  />
                  <List.Item
                    title={"Dark"}
                    onPress={() => {
                      handleTheme("dark");
                      hideModal();
                    }}
                  />
                  <List.Item
                    title={"Light"}
                    onPress={() => {
                      handleTheme("light");
                      hideModal();
                    }}
                  />
                </List.Section>
              </ScrollView>
            </Modal>
          </Portal>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              style={{
                borderColor: theme.colors.onPrimaryContainer,
                borderRadius: 4,
              }}
              onPress={() => {
                showModal();
              }}
            >
              {themeColor}
            </Button>
          </View>
        </View>
      </View>
      <LottieView
        autoPlay
        style={{
          width: 280,
          height: 280,
          backgroundColor: theme.colors.background,
        }}
        source={require("../assets/Lottie/thanking_idea.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
    paddingTop: 40,
  },
});
