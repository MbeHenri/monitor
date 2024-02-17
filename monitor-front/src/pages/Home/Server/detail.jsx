import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useCurrentServer,
  useIsAccessibleServer,
  useServer,
} from "../../../hooks/Server";
import { AccessibleBadge } from "../../../components/Server";
import UptimeComponent from "../../../components/Server/uptime";
import MemoryComponent from "../../../components/Server/memory";
import CpuComponent from "../../../components/Server/cpu";
import Services from "../../../components/Server/Service/services";
import { useRef } from "react";
import { ConnectServerForm } from "../../../components/Forms/ConnectServerForm";

function ServerHome() {
  const { currentServer } = useCurrentServer();
  const { deleteServer } = useServer();
  const { isAccessible } = useIsAccessibleServer(currentServer.id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleDelete = () => {
    deleteServer(currentServer.id);
  };

  return (
    <Container maxW="container.lg">
      <Stack>
        {/* <Text>{JSON.stringify(currentServer)}</Text> */}

        <Box mt="1rem">
          <HStack>
            <Heading color="primary">{currentServer.hostname}</Heading>
            <AccessibleBadge isAccessible={isAccessible} size="1.5rem" />
          </HStack>
          <Text>{currentServer.friendlyname}</Text>
        </Box>
        <HStack>
          <Button onClick={onOpen}>
            {currentServer.inSession ? "Deconnecter" : "Connecter"}
          </Button>
          <ConnectServerForm
            finalRef={finalRef}
            initialRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
          />

          <Button colorScheme="red" onClick={handleDelete}>
            Supprimer
          </Button>
        </HStack>

        <Tabs mt="2rem">
          <TabList>
            <Tab>Details</Tab>
            <Tab>Services</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pl="0" pr="0">
              {currentServer.inSession ? (
                <Stack>
                  <UptimeComponent />
                  <MemoryComponent />
                  <CpuComponent />
                </Stack>
              ) : (
                <p>Vous n'etes pas connecter au serveur</p>
              )}
            </TabPanel>
            <TabPanel>
              {currentServer.inSession ? (
                <Services />
              ) : (
                <p>Vous n'etes pas connecter au serveur</p>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default ServerHome;
