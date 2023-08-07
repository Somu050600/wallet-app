import React, { useEffect, useState } from "react";
import { Portal, Snackbar, useTheme } from "react-native-paper";

const BottomMessage = ({ message }) => {
  const [visible, setVisible] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    setVisible(true);
  }, [message]);
  return (
    <Portal>
      <Snackbar
        theme={theme.colors.inverseOnSurface}
        visible={visible}
        duration={5000}
        onDismiss={() => setVisible(false)}
        action={{
          label: "close",
        }}
      >
        {message}
      </Snackbar>
    </Portal>
  );
};

export default BottomMessage;
