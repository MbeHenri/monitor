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
} from "@chakra-ui/react";
import { useServers } from "../../hooks/Server";
import empty_server_img from "../../assets/empty_server.png";
import { AddIcon } from "@chakra-ui/icons";
import { format_ratio_2_per } from "../../utils/functions";

function DefaultHome() {
  const { isLoading, servers } = useServers();

  const perAccesible = percentageAccessible(servers);
  const perSession = percentageInSession(servers);

  return (
    <Container maxW="container.lg">
      <Stack gap={4} pt={10}>
        <Heading color="primary">Dashboard</Heading>
        {isLoading ? (
          StatsBody(isLoading, servers, perAccesible, perSession)
        ) : servers.length > 0 ? (
          StatsBody(isLoading, servers, perAccesible, perSession)
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
              <Button size="lg" leftIcon={<AddIcon />}>
                Ajouter
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}

function StatsBody(isLoading, servers, perAccesible, perSession) {
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
            <StatNumber>{isLoading ? null : `${perAccesible} %`}</StatNumber>
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

function percentageAccessible(servers) {
  const per =
    servers.filter((server) => server.isAccessible).length / servers.length;
  return format_ratio_2_per(per);
}

function percentageInSession(servers) {
  const per =
    servers.filter((server) => server.inSession).length / servers.length;
  return format_ratio_2_per(per);
}

export default DefaultHome;
