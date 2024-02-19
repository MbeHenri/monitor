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
        {cpus ? <StatNumber>{cpus.length}</StatNumber> : <Spinner />}
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
          <></>
        )}
      </Grid>
    </Stack>
  );
}
export default CpuComponent;
