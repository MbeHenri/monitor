import {
  Button,
  Card,
  CardBody,
  Heading,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useServer } from "../../providers/Server/hooks";
import { AddIcon } from "@chakra-ui/icons";
import { format_ratio_2_per } from "../../utils/functions";
import { AddServerForm } from "../../components/Forms/AddServerForm";
import { useRef } from "react";

function DefaultHome() {
  return <BodyHome />;
}

function BodyHome() {
  const { isLoading, servers, isAccesibleServers, isInConnection } =
    useServer();

  const perAccesible = percentageAccessible(servers, isAccesibleServers);
  const perSession = percentageInSession(servers, isInConnection);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <Stack gap={4} mt="1.5rem">
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
        <VStack align="center" pt="20vh" gap="10">
          <Heading size="lg">Vous n'avez aucun serveur !!!</Heading>
          <Button onClick={onOpen} size="lg" leftIcon={<AddIcon />}>
            Ajouter
          </Button>
          <AddServerForm
            finalRef={finalRef}
            initialRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
          />
        </VStack>
      )}
    </Stack>
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
    servers.filter((server) => isAccesibleServers.get(server.id)).length /
    servers.length;
  return format_ratio_2_per(per);
}

function percentageInSession(servers, isInConnection) {
  const per =
    servers.filter((server) => isInConnection.get(server.id)).length /
    servers.length;
  return format_ratio_2_per(per);
}

export default DefaultHome;
