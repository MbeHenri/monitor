import { HStack, Spinner, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useCurrentServer } from "../../providers/Server/hooks";
import { useCmdServer } from "../../providers/Server/hooks";

export function UptimeComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "uptime");
  const uptime = data;

  return (
    <HStack align="start">
      {/* <Text>{uptime && JSON.stringify(uptime)}</Text> */}
      <Stat>
        <StatLabel color="secondary">dates</StatLabel>
        <StatNumber>{uptime ? `${uptime.days}` : <Spinner />}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel color="secondary">hours</StatLabel>
        <StatNumber>
          {uptime ? `${uptime.hours}:${uptime.minutes}` : <Spinner />}
        </StatNumber>
      </Stat>
    </HStack>
  );
}

export default UptimeComponent;
