import {
  Button,
  Portal,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useServer } from "../../hooks/Server";

export function AddServerForm({ initialRef, finalRef, isOpen, onClose }) {
  const { addServer } = useServer();

  // variables du formulaire
  const [hostname, setHostname] = useState("");
  const [errorHostname, setErrorHostname] = useState(false);
  const [friendlyname, setFriendlyname] = useState("");

  const clear = useCallback(() => {
    setIsSubmitting(false);
    errorHostname && setErrorHostname(false);
    setHostname("");
    setFriendlyname("");
  }, [errorHostname]);

  const close = useCallback(() => {
    clear();
    onClose();
  }, [clear, onClose]);

  const handleChangeHostname = useCallback(
    (event) => {
      setHostname(event.target.value);
      errorHostname && setErrorHostname(false);
    },
    [errorHostname]
  );

  const handleChangeFriendlyname = useCallback((event) => {
    setFriendlyname(event.target.value);
  }, []);

  // state for submitting authenticate form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // méthode pour soumettre le formulaire
  const handleSubmit = useCallback(
    (event) => {
      if (event.key && event.key !== "Enter") {
        return;
      }
      if (hostname === "") {
        setErrorHostname(true);
      } else {
        setIsSubmitting(true);
        addServer({ hostname: hostname, friendlyname: friendlyname }).finally(
          () => {
            setIsSubmitting(false);
            close();
          }
        );
      }
    },
    [addServer, close, friendlyname, hostname]
  );

  return (
    <Portal>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={close}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add our server</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Hostname</FormLabel>
              <Input
                isInvalid={errorHostname}
                placeholder="hostname"
                onKeyDown={handleSubmit}
                onChange={handleChangeHostname}
                value={hostname}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Friendly name</FormLabel>
              <Input
                placeholder="friendly name"
                onKeyDown={handleSubmit}
                onChange={handleChangeFriendlyname}
                value={friendlyname}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              background="primary"
              colorScheme="primary"
              _hover={{
                background: "secondary",
                colorScheme: "secondary",
              }}
              isLoading={isSubmitting}
              mr={3}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
}
