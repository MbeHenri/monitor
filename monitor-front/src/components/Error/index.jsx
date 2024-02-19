import { Container, Image, Heading, VStack } from "@chakra-ui/react";
import error_404 from "../../assets/undraw_page_not_found.svg";

function Error({ error = null }) {
  var message = "Il semblerait qu’il y ait un problème";
  if (error) {
    message = JSON.stringify(error);
  }

  return (
    <Container mt="container.lg">
      <VStack mt="20vh">
        <Heading textAlign="center"> Oups ... </Heading>
        <Image src={error_404} width="100%" />
        <Heading textAlign="center">{message}</Heading>
      </VStack>
    </Container>
  );
}

export default Error;
