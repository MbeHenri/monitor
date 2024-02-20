import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme(
  {
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
    colors: {
      primary: { 200: "#88A6E9", 700: "#265dd6", 900: "#132974" },
      secondary: { 200: "#f3da83", 700: "#DBB447", 900: "#866509" },
      header: { 200: "#283143", 700: "#313C53", 900: "#E0E7F4" },
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
          default: "primary.900",
          _dark: "primary.200",
        },
        header: {
          default: "header.900",
          _dark: "header.200",
        },
        onprimary: {
          default: "gray.50",
          _dark: "gray.900",
        },
        colorshemeprimary: "primary",
        colorshemedanger: "red",
        black_write: {
          default: "gray.800",
          _dark: "gray.100",
        },
        secondary: {
          default: "secondary.900",
          _dark: "secondary.200",
        },
        onsecondary: {
          default: "gray.50",
          _dark: "gray.900",
        },

        bgheardercard: {
          default: "gray.300",
          _dark: "gray.900",
        },
        onbgheardercard: {
          default: "gray.900",
          _dark: "gray.100",
        },
      },
    },
  }
  // withDefaultColorScheme({ colorScheme: "blue" })
);
