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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useServer } from "../../hooks/Server";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export function ConnectServerForm({ initialRef, finalRef, isOpen, onClose }) {
  // const { addServer } = useServer();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // state for handle password field
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [errorConnect, setErrorConnect] = useState(false);

  const clear = () => {
    setIsSubmitting(false);
    errorConnect && setErrorConnect(false);
    setLogin("");
    setPassword("");
  };

  const close = () => {
    clear();
    onClose();
  };

  const handleChangeLogin = (event) => {
    setLogin(event.target.value);
    errorConnect && setErrorConnect(false);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  // state for submitting authenticate form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // function to handle a submittion
  const handleSubmit = (event) => {
    if (event.key && event.key !== "Enter") {
      return;
    }
    if (login === "") {
      setErrorConnect(true);
    } else {
      setIsSubmitting(true);
      /* addServer({ Login: login, Password: password }).finally(() => {
        setIsSubmitting(false);
        close();
      }); */
    }
  };
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
              <FormLabel>Login</FormLabel>
              <Input
                isInvalid={errorConnect}
                placeholder="Login"
                onKeyDown={handleSubmit}
                onChange={handleChangeLogin}
                value={login}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handleChangePassword}
                  onKeyDown={handleSubmit}
                  value={password}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {/* errorInputPassword && <Text color="error">Password empty</Text> */}
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
              Connect
            </Button>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
}
