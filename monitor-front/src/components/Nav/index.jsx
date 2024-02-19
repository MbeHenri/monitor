import {
  HStack,
  Text,
  Stack,
  Skeleton,
  Hide,
  Button,
  Box,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { AddIconServer } from "../AddIconServer";
import Server from "../Server";
import { useCurrentServer, useServer } from "../../providers/Server/hooks";
import { Link } from "react-router-dom";

export function LinkDashboard({ onClose = () => {} }) {
  const { clearCurrentServer } = useCurrentServer();
  return (
    <Button
      variant="link"
      color="primary"
      fontSize="xl"
      fontWeight="bold"
      as={Link}
      onClick={() => {
        clearCurrentServer();
        onClose();
      }}
      to="/"
    >
      Home
    </Button>
  );
}

export function Nav({ onClose = () => {} }) {
  const { servers, isLoading, error } = useServer();
  return (
    <Box>
      <Hide above="md">
        <LinkDashboard onClose={onClose} />
      </Hide>
      <HStack pt={4}>
        <Heading color="primary" size="md">
          My Servers
        </Heading>
        {!isLoading ? (
          <>{servers.length > 0 ? <AddIconServer /> : <></>}</>
        ) : (
          <Spinner />
        )}
      </HStack>
      {isLoading ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : error ? (
        <></>
      ) : (
        <>
          {servers.length > 0 ? (
            <Stack pt="1rem">
              {servers.map((server, index) => (
                <Server
                  key={`server-${index}`}
                  data={server}
                  closeNav={onClose}
                />
              ))}
            </Stack>
          ) : (
            <Text>Aucun serveur</Text>
          )}
        </>
      )}
    </Box>
  );
}
