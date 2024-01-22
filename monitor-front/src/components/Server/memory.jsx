import { Box, Card, CardBody, CardHeader, HStack, Heading, Text } from "@chakra-ui/react";
import { useCurrentServer, useInfosMemoriesServer } from "../../hooks/Server";
import { format_ratio_2_per } from "../../utils/functions";


function MemoryComponent() {
    const { currentServer } = useCurrentServer();
    const { memories } = useInfosMemoriesServer(currentServer.id);
  
    return (
      <Card>
        <CardHeader color="onbgheardercard" bgColor="bgheardercard">
          <Heading as="h2" size="md">
            Memories
          </Heading>
        </CardHeader>
        <CardBody>
          {/* <Text>{memories && JSON.stringify(memories)}</Text> */}
          <HStack direction="row">
            <Box>
              <Heading size="sm">Memoire</Heading>
              <Text>{memories.mem && memories.mem.total}</Text>
              <Text>
                {memories.mem && `${format_ratio_2_per(memories.mem.used)}%`}
              </Text>
            </Box>
            <Box>
              <Heading size="sm">Swap</Heading>
              <Text>{memories.swap && memories.swap.total}</Text>
              <Text>
                {memories.swap && `${format_ratio_2_per(memories.swap.used)}%`}
              </Text>
            </Box>
            <Box>
              <Heading size="sm">Disk</Heading>
              <Text>{memories.disk && memories.disk.total}</Text>
              <Text>
                {memories.disk && `${format_ratio_2_per(memories.disk.used)}%`}
              </Text>
            </Box>
          </HStack>
        </CardBody>
      </Card>
    );
  }
export default MemoryComponent;  