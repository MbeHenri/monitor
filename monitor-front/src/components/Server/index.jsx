import { Button, Tooltip } from "@chakra-ui/react";
import {
  useCurrentServer,
  useIsAccessibleServer,
} from "../../providers/Server/hooks";
import { StateBadge } from "../../utils/Atoms";

function ServerComponent({ data, closeNav }) {
  const { currentServer, updateCurrentServer } = useCurrentServer();
  const isCurrentServer = currentServer && currentServer.id === data.id;

  const { isAccessible } = useIsAccessibleServer(data.id);
  return (
    <>
      <Tooltip
        label={data.friendlyname}
        aria-label="A tooltip"
      >
        <Button
          justifyContent="left"
          iconSpacing={4}
          fontWeight="500"
          borderRadius="0"
          leftIcon={<AccessibleBadge isAccessible={isAccessible} />}
          _hover={{
            textDecoration: "none",
          }}
          colorScheme={isCurrentServer ? "primary" : null}
          bgColor={isCurrentServer ? "primary" : null}
          onClick={() => {
            updateCurrentServer(data);
            closeNav();
          }}
        >
          {data.hostname}
        </Button>
      </Tooltip>
    </>
  );
}

export function AccessibleBadge({ isAccessible, size = "1rem" }) {
  return (
    <>
      <StateBadge state={isAccessible ? "good" : "bad"} size={size} />
    </>
  );
}

export default ServerComponent;
