import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AccessibleBadge } from "..";

function ServiceComponent({ data }) {
  /* const { currentServer } = useCurrentServer(); */

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        fontWeight="300"
        borderRadius="0"
        justifyContent="left"
        leftIcon={<AccessibleBadge isAccessible={data.is_active} />}
        w="100%"
        onClick={onOpen}
      >
        {data.name.length > 7 ? data.name.substring(0, 6) + "..." : data.name}
      </Button>
      <Portal>
        <Modal onClose={onClose} isOpen={isOpen} isCentered size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <HStack>
                <Text fontWeight="bold">Name :</Text> <Text> {data.name} </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Loaded :</Text>
                <AccessibleBadge isAccessible={data.is_loaded} />
              </HStack>
              <HStack>
                <Text fontWeight="bold">Actived :</Text>
                <AccessibleBadge isAccessible={data.is_active} />
              </HStack>
              <HStack>
                <Text fontWeight="bold">State :</Text>
                <Text> {data.state} </Text>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </>
  );
}

export default ServiceComponent;
