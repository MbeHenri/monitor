import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useCurrentServer, useInfosCPUServer } from "../../hooks/Server";
import { format_ratio_2_per } from "../../utils/functions";

function CpuComponent() {
  const { currentServer } = useCurrentServer();
  const { cpus } = useInfosCPUServer(currentServer.id);

  return (
    <Card>
      <CardHeader color="onbgheardercard" bgColor="bgheardercard">
        <Heading as="h2" size="md">
          CPUS
        </Heading>
      </CardHeader>
      <CardBody>
        <Stat>
          <StatLabel color="secondary">total</StatLabel>
          <StatNumber>{cpus && cpus.length}</StatNumber>
        </Stat>
        <Grid>
          {cpus &&
            cpus.map((cpu, id) => (
              <GridItem key={`cpu-${id}`}>
                <Text>{`cpu ${id + 1}`}</Text>
                <Progress value={format_ratio_2_per(cpu.used)} />
              </GridItem>
            ))}
        </Grid>
      </CardBody>
    </Card>
  );
}
export default CpuComponent;
