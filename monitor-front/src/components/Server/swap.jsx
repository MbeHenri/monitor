import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useCurrentServer } from "../../hooks/Server";
import { format_ratio_2_per } from "../../utils/functions";
import { useCmdServer } from "../../providers/Server/hooks";

function SwapComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "swap");
  const swap = data;

  return (
    <Box>
      <Heading size="sm">Swap</Heading>
      <Text>{swap ? swap.size : <Spinner />}</Text>
      {swap ? <Text>`${format_ratio_2_per(swap.used)}%`</Text> : <Spinner />}
    </Box>
  );
}
export default SwapComponent;
