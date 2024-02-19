import {
  Container,
  Flex,
  Image,
  Box,
  Button,
  useColorMode,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  DrawerCloseButton,
  DrawerFooter,
  Text,
  Stack,
  Divider,
  Skeleton,
  IconButton,
  Hide,
  Link,
  Show,
} from "@chakra-ui/react";
import { EditIcon, LockIcon, HamburgerIcon } from "@chakra-ui/icons";

import logo_light from "../../assets/logo_light.svg";
import logo_dark from "../../assets/logo_dark.svg";

import ThemeButton from "../ThemeButton";
import PrivateComponent from "../PrivateComponent";
import { AddIconServer } from "../AddIconServer";
import Server from "../Server";

import { useAuth } from "../../providers/Auth/hooks";
import { useCurrentServer, useServer } from "../../providers/Server/hooks";

function Header() {
  const { colorMode } = useColorMode();
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { servers, isLoading, error, deconnexionServers } = useServer();
  const { clearCurrentServer } = useCurrentServer();

  return (
    <>
      {/* vue principale de l'header */}
      <Box pt={2} pb={2}>
        <Container maxW="container.lg">
          <Hide above="md">
            <Flex justify="space-between" align="center">
              <HStack>
                <PrivateComponent is_component={true}>
                  <IconButton
                    variant="ghost"
                    colorScheme="blue"
                    onClick={onOpen}
                    p="0"
                    icon={<HamburgerIcon />}
                  />
                </PrivateComponent>
              </HStack>
              <Image
                src={colorMode === "light" ? logo_light : logo_dark}
                h={45}
                alt="monitor"
              />
              <HStack>
                <ThemeButton size="md" />
              </HStack>
            </Flex>
          </Hide>
          <Show above="md">
            <Flex justify="space-between" align="center">
              <Image
                src={colorMode === "light" ? logo_light : logo_dark}
                h={45}
                alt="monitor"
              />
              <HStack>
                <ThemeButton size="md" />
              </HStack>
            </Flex>
          </Show>
        </Container>
      </Box>
      <Hide above="md">
        <PrivateComponent is_component={true}>
          {/* drawer de l'header */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader pl={0} pr={0} pt={2} pb={2}>
                <Container>
                  <HStack>
                    <Image
                      src={colorMode === "light" ? logo_light : logo_dark}
                      h={45}
                      alt="monitor"
                    />
                    <Text>Monitor</Text>
                  </HStack>
                </Container>
              </DrawerHeader>

              {/* Liste des serveurs */}
              <DrawerBody pt={4}>
                <Button
                  variant="link"
                  as={Link}
                  onClick={() => {
                    clearCurrentServer();
                    onClose();
                  }}
                >
                  <Text color="primary" fontSize="xl">
                    Dashboard
                  </Text>
                </Button>
                <HStack pt={4}>
                  {!isLoading ? (
                    <>
                      {servers.length > 0 ? (
                        <>
                          <Text color="primary" fontSize="xl">
                            Mes Serveurs
                          </Text>
                          <AddIconServer />
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </HStack>
                {isLoading ? (
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                ) : error ? (
                  <Text>Erreur</Text>
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
                      <Stack textAlign="center" mt="27vh">
                        <Text>Aucun serveur n'est visible</Text>
                      </Stack>
                    )}
                  </>
                )}
              </DrawerBody>

              <Divider />
              <DrawerFooter>
                <Button
                  leftIcon={<EditIcon />}
                  variant="link"
                  as={Link}
                  mr="1rem"
                >
                  Settings
                </Button>
                <Button
                  leftIcon={<LockIcon />}
                  colorScheme="red"
                  onClick={() =>
                    deconnexionServers().then((ok) => {
                      return ok && logout();
                    })
                  }
                >
                  SignOut
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </PrivateComponent>
      </Hide>
    </>
  );
}

export default Header;
