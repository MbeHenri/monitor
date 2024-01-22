import { Box } from "@chakra-ui/react";

export function StateBadge({ size = "1rem", state = "good" }) {
  return (
    <Box
      h={size}
      w={size}
      borderRadius="50%"
      as="span"
      bgColor={
        state === "good"
          ? "green.500"
          : state === "bad"
          ? "red.500"
          : "orange.500"
      }
    />
  );
}
