import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useCurrentServer } from "../../hooks/Server";
import { format_ratio_2_per } from "../../utils/functions";
import { useCmdServer } from "../../providers/Server/hooks";

function MemoryComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "memory");
  const memory = data;

  return (
    <Box>
      <Heading size="sm">Memoire</Heading>
      <Text>{memory ? memory.size : <Spinner />}</Text>
      {memory ? (
        <Text>`${format_ratio_2_per(memory.used)}%`</Text>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}
export default MemoryComponent;
