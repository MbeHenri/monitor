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
        {uptime ? <StatNumber>`${uptime.days}` </StatNumber> : <Spinner />}
      </Stat>
      <Stat>
        <StatLabel color="secondary">hours</StatLabel>

        {uptime ? (
          <StatNumber>
            `${uptime.hours}:${uptime.minutes}`
          </StatNumber>
        ) : (
          <Spinner />
        )}
      </Stat>
    </HStack>
  );
}

export default UptimeComponent;
