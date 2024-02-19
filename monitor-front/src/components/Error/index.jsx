import { Container, Image, Heading, VStack } from "@chakra-ui/react";
import error_404 from "../../assets/page-not-found.png";
import error_disconnect from "../../assets/disconnected.png";

function Error({ error = null }) {
  var message = "Page existante";
  var image = error_404;
  if (error) {
    switch (error.type) {
      case "any":
        message = "Impossible de se connecter à Monitor !!";
        image = error_disconnect;
        break;

      default:
        message = JSON.stringify(error);
        break;
    }
  }

  return (
    <Container mt="container.lg">
      <VStack mt="15vh">
        <Image src={image} width="100%" />
        <Heading textAlign="center">{message}</Heading>
      </VStack>
    </Container>
  );
}

export default Error;
