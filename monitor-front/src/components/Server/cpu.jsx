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
  const { cpus } = useCmdServer(currentServer.id, "cpu");

  return (
    <Stack>
      <Stat>
        <StatLabel color="secondary">total</StatLabel>
        <StatNumber>{cpus ? cpus.length : <Spinner />}</StatNumber>
      </Stat>
      <Grid>
        {cpus ? (
          cpus.map((cpu, id) => (
            <GridItem key={`cpu-${id}`}>
              <Text>{cpu.num}</Text>
              <Progress value={cpu.used} />
            </GridItem>
          ))
        ) : (
          <Spinner />
        )}
      </Grid>
    </Stack>
  );
}
export default CpuComponent;
