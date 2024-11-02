// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        margin: 0,
        padding: 0,
        height: "100%",
      },
    },
  },
  colors: {
    gray: {
      50: "#f9f9f9", // Cambia el color gris claro
      100: "#e2e8f0", // Cambia el color gris más oscuro
    },
  },
});

export default theme;
