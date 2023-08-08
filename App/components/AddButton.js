import React from "react";
import { FAB, useTheme } from "react-native-paper";

export default function AddButton({ navigation }) {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });
  const theme = useTheme();

  const { open } = state;

  const handleInput = () => {
    navigation.navigate("CCInput");
  };

  return (
    <FAB.Group
      loading={true}
      open={open}
      icon={open ? "window-close" : "plus"}
      elevation="500"
      variant="tertiary"
      actions={[
        { icon: "plus", onPress: () => console.log("Pressed add") },
        {
          icon: "star",
          label: "Favorites",
          onPress: () => console.log("Pressed star"),
        },
        {
          icon: "card-account-details",
          label: "Addhar Card",
          onPress: () => console.log("Pressed email"),
        },
        {
          icon: "credit-card",
          label: "Add Card",
          onPress: () => handleInput(),
          small: false,
        },
      ]}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
}
