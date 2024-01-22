import { Box } from "@chakra-ui/react";
import DefaultHome from "./default";
import { useCurrentServer } from "../../hooks/Server";
import ServerHome from "./Server/detail";

function Home() {
  const { currentServer } = useCurrentServer();
  return <Box>{currentServer ? <ServerHome /> : <DefaultHome />}</Box>;
}

export default Home;
