import {
  Grid,
  GridItem,
  Progress,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useCmdServer, useCurrentServer } from "../../providers/Server/hooks";

function CpuComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "cpu");
  const cpus = data;

  return (
    <Stack>
      <Stat>
        <StatLabel color="secondary">total</StatLabel>
        {cpus ? <StatNumber>{cpus.length}</StatNumber> : <Spinner />}
      </Stat>
      <Grid templateColumns='repeat(4, 1fr)' gap='5'>
        {cpus ? (
          cpus.map((cpu, id) => (
            <GridItem key={`cpu-${id}`}>
              <Text>{`CPU ${cpu.num}`}</Text>
              <Progress value={cpu.used} />
            </GridItem>
          ))
        ) : (
          <></>
        )}
      </Grid>
    </Stack>
  );
}
export default CpuComponent;
