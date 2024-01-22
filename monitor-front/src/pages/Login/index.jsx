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
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import logo_dark from "../../assets/logo_dark.svg";
import logo_light from "../../assets/logo_light.svg";
import bgimagedark from "../../assets/laptop-computer-dark.jpg";
import bgimagelight from "../../assets/laptop-computer-light.jpg";
import ThemeButton from "../../components/ThemeButton";
import { useAuth } from "../../hooks/Auth";

function Login() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [errorInputUsername, seterrorInputUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [errorInputPassword, seterrorInputPassword] = useState(false);
  const handleChangeUserName = (event) => {
    setUsername(event.target.value);
    seterrorInputUsername(false);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    seterrorInputPassword(false);
  };

  const handleSubmit = (event) => {
    if (event.key && event.key !== "Enter") {
      return;
    }
    console.log(username);
    console.log(password);
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
    <HStack h="100vh">
      <Container>
        <Stack spacing={9} mt="0" p="2rem">
          <Stack>
            <Image
              src={colorMode === "dark" ? logo_dark : logo_light}
              h={70}
              alt="monitor"
              mb="1rem"
            />
            <Heading>Sign In</Heading>
            <Text>Connectez vous pour monitorer vos serveurs</Text>
          </Stack>
          {/* username entry group */}
          <Stack spacing={2}>
            <Text> Username </Text>
            <Input
              pr="4.5rem"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={handleChangeUserName}
              isInvalid={errorInputUsername}
              onKeyDown={handleSubmit}
            />
            {/* errorInputUsername && <Text size="xs" fontWeight="hairline" color="error">username empty</Text> */}
          </Stack>

          {/* password entry group */}
          <Stack>
            <Text> Password </Text>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={handleChangePassword}
                isInvalid={errorInputPassword}
                onKeyDown={handleSubmit}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* errorInputPassword && <Text color="error">Password empty</Text> */}
          </Stack>

          {/* Send Button */}
          <Button
            isLoading={isSubmitting}
            loadingText={"Submitting"}
            bg="primary"
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
  );
}

export default Login;
