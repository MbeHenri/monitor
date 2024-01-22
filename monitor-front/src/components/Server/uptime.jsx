import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useCurrentServer, useInfosUptimeServer } from "../../hooks/Server";

export function UptimeComponent() {
  const { currentServer } = useCurrentServer();
  const { uptime } = useInfosUptimeServer(currentServer.id);
  return (
    <Card>
      <CardHeader color="onbgheardercard" bgColor="bgheardercard">
        <Heading as="h2" size="md">
          Uptime
        </Heading>
      </CardHeader>
      <CardBody>
        {/* <Text>{uptime && JSON.stringify(uptime)}</Text> */}
        <HStack align="start">
          <Stat>
            <StatLabel color="secondary">date</StatLabel>
            <StatNumber>{uptime && uptime.date}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel color="secondary">heure</StatLabel>
            <StatNumber>{uptime && uptime.time}</StatNumber>
          </Stat>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default UptimeComponent;
