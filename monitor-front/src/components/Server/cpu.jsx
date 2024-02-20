import {
  Grid,
  GridItem,
  Progress,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCmdServer, useCurrentServer } from "../../providers/Server/hooks";

function CpuComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "cpu");
  const cpus = data;

  return (
    <Stack>
      <Grid templateColumns='repeat(4, 1fr)' gap='5'>
        {cpus ? (
          cpus.map((cpu, id) => (
            <GridItem key={`cpu-${id + 1}`}>
              <Text>{`CPU ${cpu.num}`}</Text>
              <Progress value={cpu.used} />
            </GridItem>
          ))
        ) : (
          <Spinner/>
        )}
      </Grid>
    </Stack>
  );
}
export default CpuComponent;
