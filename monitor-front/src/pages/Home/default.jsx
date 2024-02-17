import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useServer } from "../../hooks/Server";
import empty_server_img from "../../assets/empty_server.png";
import { AddIcon } from "@chakra-ui/icons";
import { format_ratio_2_per } from "../../utils/functions";
import { AddServerForm } from "../../components/AddServerForm";
import { useRef } from "react";

function DefaultHome() {
  const { isLoading, servers, isAccesibleServers, sessions } = useServer();

  const perAccesible = percentageAccessible(servers, isAccesibleServers);
  const perSession = percentageInSession(servers, sessions);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <Container maxW="container.lg">
      <Stack gap={4} pt={10}>
        <Heading color="primary">Dashboard</Heading>
        {isLoading ? (
          <StatsBody
            isLoading={isLoading}
            servers={servers}
            perAccesible={perAccesible}
            perSession={perSession}
          />
        ) : servers.length > 0 ? (
          <StatsBody
            isLoading={isLoading}
            servers={servers}
            perAccesible={perAccesible}
            perSession={perSession}
          />
        ) : (
          <>
            <Stack align="center">
              <Box
                bgImage={empty_server_img}
                bgSize={"cover"}
                bgPosition="center"
                w="100%"
                h="50vh"
              />
              <Text>Aucun serveur pour le moment</Text>
              <Button onClick={onOpen} size="lg" leftIcon={<AddIcon />}>
                Ajouter
              </Button>
              <AddServerForm
                finalRef={finalRef}
                initialRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}

function StatsBody({ isLoading, servers, perAccesible, perSession }) {
  return (
    <>
      {/* Statistiques sur les serveurs enrégistrées */}
      <Card bgColor="primary" color="onprimary">
        <CardBody>
          <Stat>
            <StatLabel>Nombre de Serveurs</StatLabel>
            <StatNumber>
              {isLoading ? <Spinner _indeterminate={true} /> : servers.length}
            </StatNumber>
          </Stat>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Stat>
            <StatLabel color="secondary">
              Taux de serveurs accéssibles
            </StatLabel>
            <StatNumber>{isLoading ? null : `${perAccesible} %`}</StatNumber>
          </Stat>
          {isLoading ? (
            <Skeleton height="20px" />
          ) : (
            <Progress value={perAccesible} />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Stat>
            <StatLabel color="secondary">Taux de serveurs en session</StatLabel>
            <StatNumber>{isLoading ? null : `${perSession} %`}</StatNumber>
          </Stat>
          {isLoading ? (
            <Skeleton height="20px" />
          ) : (
            <Progress value={perSession} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

function percentageAccessible(servers, isAccesibleServers) {
  const per =
    servers.filter((server) => isAccesibleServers[server.id]).length /
    servers.length;
  return format_ratio_2_per(per);
}

function percentageInSession(servers, sessions) {
  const per =
    servers.filter((server) => sessions[server.id]).length / servers.length;
  return format_ratio_2_per(per);
}

export default DefaultHome;
