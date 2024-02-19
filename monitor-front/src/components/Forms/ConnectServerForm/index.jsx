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
import { useServer } from "../../../providers/Server/hooks";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export function ConnectServerForm({
  idServer,
  initialRef,
  finalRef,
  isOpen,
  onClose,
}) {
  const { connexionServer } = useServer();

  // variable pour le formulaire

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // state for handle password field
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const clear = () => {
    setIsSubmitting(false);
    errorLogin && setErrorLogin(false);
    errorPassword && setErrorPassword(false);
    setLogin("");
    setPassword("");
  };

  const close = () => {
    clear();
    onClose();
  };

  const handleChangeLogin = (event) => {
    setLogin(event.target.value);
    errorLogin && setErrorLogin(false);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    errorPassword && setErrorPassword(false);
  };

  // state for submitting authenticate form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // function to handle a submittion
  const handleSubmit = (event) => {
    if (event.key && event.key !== "Enter") {
      return;
    }
    if (login === "" || password === "") {
      login === "" && setErrorLogin(true);
      password === "" && setErrorPassword(true);
    } else {
      setIsSubmitting(true);
      connexionServer(idServer, { login: login, password: password }).finally(
        () => {
          setIsSubmitting(false);
          close();
        }
      );
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
                isInvalid={errorLogin}
                placeholder="Login"
                onKeyDown={handleSubmit}
                onChange={handleChangeLogin}
                value={login}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  isInvalid={errorPassword}
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
