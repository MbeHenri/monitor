import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      ".root": {
        div: {
          width: "100%",
          height: "100%",
        },
      },
    },
  },
  fonts: {
    heading: 'Monaco, "Courier New" ,"Trebuchet MS", Helvetica, sans-serif',
    body: 'Monaco, "Courier New", "Trebuchet MS", Helvetica, sans-serif',
  },
  semanticTokens: {
    colors: {
      error: {
        default: "red.600",
        dark: "red.200",
      },
      success: "green.500",
      primary: {
        default: "blue.900",
        _dark: "blue.200",
      },
      onprimary: {
        default: "gray.50",
        _dark: "gray.900",
      },
      colorshemeprimary: "blue",
      colorshemedanger: "red",
      /* background:{
        default: "gray.100",
        _dark: "gray.800",
      }, */
      secondary: {
        default: "yellow.900",
        _dark: "yellow.200",
      },
      onsecondary: {
        default: "gray.50",
        _dark: "gray.900",
      },

      bgheardercard: {
        default: "gray.100",
        _dark: "gray.900",
      },
      onbgheardercard: {
        default: "gray.900",
        _dark: "gray.100",
      },
    },
  },
});
