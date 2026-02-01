import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");

  const onLogin = () => {
    navigation.navigate("Main", { username: username });
  };

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View
        style={{
          width: 120,
          height: 120,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 60,
          borderWidth: 1,
          borderColor: "#FFF",
          alignSelf: "center",
        }}
      >
        <FontAwesome5 name="user-alt" size={80} color="#FFF" />
      </View>

      <TextInput
        style={{
          color: "#FFF",
          borderWidth: 1,
          borderColor: "#FFF",
          padding: 10,
          borderRadius: 10,
          marginTop: 40,
        }}
        value={username}
        onChangeText={setUsername}
        placeholder="Your name"
        placeholderTextColor="#FFF"
      />

      <TouchableOpacity
        disabled={username.length < 3}
        style={{
          borderWidth: 1,
          borderColor: "#FFF",
          padding: 15,
          marginTop: 20,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#6D8AFE",
          opacity: username.length < 3 ? 0.5 : 1,
        }}
        onPress={() => onLogin()}
      >
        <Text
          style={{
            color: "#FFF",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          ENTER
        </Text>
      </TouchableOpacity>
    </View>
  );
}
