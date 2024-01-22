import { Button, useColorMode } from "@chakra-ui/react";

function ThemeButton({ size = "lg" }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      borderRadius={50}
      paddingLeft={1}
      paddingRight={1}
      paddingTop={2}
      paddingBottom={2}
      borderWidth={1}
      borderColor={"Background"}
      size={size}
      onClick={() => toggleColorMode()}
    >
      {colorMode === "light" ? "☀️" : "🌙"}
    </Button>
  );
}
export default ThemeButton;
