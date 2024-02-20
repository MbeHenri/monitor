import {
  Container,
  Flex,
  Image,
  Box,
  Button,
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
  Divider,
  IconButton,
  Hide,
  Show,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import logo from "../../assets/logo.png";
//import account_light from "../../assets/account_light.png";
//import account_dark from "../../assets/account_dark.png";

import ThemeButton from "../ThemeButton";
import PrivateComponent from "../PrivateComponent";

import { useAuth } from "../../providers/Auth/hooks";
import { useServer } from "../../providers/Server/hooks";
import { LinkDashboard, Nav } from "../Nav";
import { Link } from "react-router-dom";

function PersonalComponent() {
  const { logout } = useAuth();
  const { deconnexionServers } = useServer();

  return (
    <HStack gap={3}>
      <Button variant="link" fontWeight="bold" as={Link} color="black_write">
        Settings
      </Button>
      <Button
        colorScheme="red"
        onClick={() => deconnexionServers().then(() => logout())}
      >
        Log out
      </Button>
    </HStack>
  );
}

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* vue principale de l'header */}
      <Box
        pt={2}
        pb={2}
        pos="sticky"
        top="0"
        right="0"
        zIndex="10"
        bgColor="header"
      >
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
              <Image src={logo} h={45} alt="monitor" />
              <HStack>
                <ThemeButton size="md" />
              </HStack>
            </Flex>
          </Hide>
          <Show above="md">
            <Flex justify="space-between" align="center">
              <HStack>
                <Image src={logo} h={45} alt="monitor" />
                <Text fontWeight="bold" fontSize="2rem">
                  Monitor
                </Text>
              </HStack>

              <HStack gap={3}>
                <LinkDashboard />
                <PersonalComponent />
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
                    <Image src={logo} h={45} alt="monitor" />
                    <Text>Monitor</Text>
                  </HStack>
                </Container>
              </DrawerHeader>

              {/* Liste des serveurs */}
              <DrawerBody pt={4}>{<Nav onClose={onClose} />}</DrawerBody>

              <Divider />
              <DrawerFooter>{<PersonalComponent />}</DrawerFooter>
            </DrawerContent>
          </Drawer>
        </PrivateComponent>
      </Hide>
    </>
  );
}

export default Header;
