import { Box, Button, Text } from "@chakra-ui/react";
import { AccessibleBadge } from "..";

function ServiceComponent({ data }) {
  /* const { currentServer } = useCurrentServer(); */
  return (
    <Box>
      <Button
        fontWeight="300"
        borderRadius="0"
        leftIcon={<AccessibleBadge isAccessible={data.is_active} />}
      >
        <Text>{data.name}</Text>
      </Button>
    </Box>
  );
}

export default ServiceComponent;
