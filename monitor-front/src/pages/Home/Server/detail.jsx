import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
} from "../../../providers/Server/hooks";
import { AccessibleBadge } from "../../../components/Server";
import UptimeComponent from "../../../components/Server/uptime";
import MemoryComponent from "../../../components/Server/memory";
import CpuComponent from "../../../components/Server/cpu";
import Services from "../../../components/Server/Service/services";
import { useCallback, useRef, useState } from "react";
import { ConnectServerForm } from "../../../components/Forms/ConnectServerForm";
import SwapComponent from "../../../components/Server/swap";
import DiskComponent from "../../../components/Server/disk";
import { useSessionServer } from "../../../providers/Server/hooks";

function ServerHome() {
  const { deleteServer, deconnexionServer } = useServer();
  const { currentServer } = useCurrentServer();
  const { isAccessible } = useIsAccessibleServer(currentServer.id);
  const { inSession, isConnecting } = useSessionServer(currentServer.id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleDelete = useCallback(() => {
    deleteServer(currentServer.id);
  }, [currentServer, deleteServer]);

  // state for submitting authenticate form
  const [isDeconneting, setIsDeconneting] = useState(false);

  // fonction pour déconnecter le serveur
  const deconnexion = useCallback(() => {
    setIsDeconneting(true);
    deconnexionServer(currentServer.id).finally(() => {
      setIsDeconneting(false);
    });
  }, [currentServer, deconnexionServer]);

  return (
    <Container maxW="container.lg">
      <Stack>
        {/* <Text>{JSON.stringify(currentServer)}</Text> */}

        <Box mt="1rem">
          <HStack>
            <Heading color="primary">{currentServer.hostname}</Heading>
            <AccessibleBadge isAccessible={isAccessible} size="1.5rem" />
          </HStack>
          {currentServer.friendlyname ? (
            <Text> {currentServer.friendlyname} </Text>
          ) : (
            <></>
          )}
        </Box>
        <HStack>
          {inSession ? (
            <Button isDisabled={isDeconneting} onClick={deconnexion}>
              Deconnecter
            </Button>
          ) : (
            <>
              <Button onClick={onOpen}>Connecter</Button>
              <ConnectServerForm
                isAccessible={isConnecting}
                idServer={currentServer.id}
                finalRef={finalRef}
                initialRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          )}

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
              {inSession ? (
                <Stack>
                  <Card>
                    <CardHeader color="onbgheardercard" bgColor="bgheardercard">
                      <Heading as="h2" size="md">
                        Memories
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <MemoryComponent />
                      <SwapComponent />
                      <DiskComponent />
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader color="onbgheardercard" bgColor="bgheardercard">
                      <Heading as="h2" size="md">
                        Uptime
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <UptimeComponent />
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader color="onbgheardercard" bgColor="bgheardercard">
                      <Heading as="h2" size="md">
                        CPUS
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <CpuComponent />
                    </CardBody>
                  </Card>
                </Stack>
              ) : (
                <p>Vous n'etes pas connecter au serveur</p>
              )}
            </TabPanel>
            <TabPanel>
              {inSession ? (
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
