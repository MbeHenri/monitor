import {
  Stack,
  Text,
  InputRightElement,
  Input,
  InputGroup,
  Button,
  Container,
  Heading,
  useColorMode,
  Image,
  HStack,
  Box,
  Show,
  FormControl,
  FormLabel,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import logo from "../../assets/logo.png";
import bgimagedark from "../../assets/laptop-computer-dark.jpg";
import bgimagelight from "../../assets/laptop-computer-light.jpg";
import ThemeButton from "../../components/ThemeButton";
import { useAuth } from "../../providers/Auth/hooks";
import { Navigate } from "react-router-dom";

function Login() {
  // state for handle password field
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // state for submitting authenticate form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();

  // state for the fields of the form
  const [username, setUsername] = useState("");
  const [errorInputUsername, seterrorInputUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [errorInputPassword, seterrorInputPassword] = useState(false);

  const handleChangeUserName = (event) => {
    setUsername(event.target.value);
    errorInputUsername && seterrorInputUsername(false);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    errorInputPassword && seterrorInputPassword(false);
  };

  // function to handle a submittion
  const handleSubmit = (event) => {
    if (event.key && event.key !== "Enter") {
      return;
    }
    /* console.log(username);
    console.log(password); */
    if (username === "" || password === "") {
      username === "" && seterrorInputUsername(true);
      password === "" && seterrorInputPassword(password === "");
    } else {
      setIsSubmitting(true);
      login({ username: username, password: password }).finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  const { colorMode } = useColorMode();

  return (
    <>
      {user ? (
        <Navigate to="/" replace />
      ) : (
        <HStack h="100vh">
          <Container>
            <Stack spacing={9} mt="0" p="2rem">
              <Stack>
                <Center>
                  <Image src={logo} h="8rem" alt="monitor" mb="1rem" />
                </Center>
                <Heading>Sign In</Heading>
                <Text>Connectez vous pour monitorer vos serveurs</Text>
              </Stack>

              {/* username entry group */}
              <FormControl mt={4} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  isInvalid={errorInputUsername}
                  placeholder="Enter Username"
                  onChange={handleChangeUserName}
                  onKeyDown={handleSubmit}
                  value={username}
                />
                {/* errorInputUsername && <Text size="xs" fontWeight="hairline" color="error">username empty</Text> */}
              </FormControl>

              {/* password entry group */}
              <FormControl mt={4} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    isInvalid={errorInputPassword}
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

              {/* Send Button */}
              <Button
                isLoading={isSubmitting}
                loadingText={"Submitting"}
                background="primary"
                variant="solid"
                colorScheme="primary"
                _hover={{
                  background: "secondary",
                  colorScheme: "secondary",
                }}
                onClick={handleSubmit}
              >
                Log in
              </Button>
            </Stack>
          </Container>
          <Show above="md">
            <Box
              bgImage={colorMode === "dark" ? bgimagedark : bgimagelight}
              bgSize={"cover"}
              bgPosition="center"
              w="55%"
              h="100vh"
              borderBottomLeftRadius="10rem"
            />
          </Show>
          <Box position="absolute" right="0" top="0" margin="2rem">
            <ThemeButton />
          </Box>
        </HStack>
      )}
    </>
  );
}

export default Login;
