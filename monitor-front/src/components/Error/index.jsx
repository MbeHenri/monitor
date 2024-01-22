import { Container, Image, Heading, VStack } from "@chakra-ui/react";
import error_image from "../../assets/undraw_page_not_found.svg";

function Error() {
  return (
    <Container mt={160}>
      <VStack>
        <Heading textAlign="center"> Oups ... </Heading>
        <Image src={error_image} width="100%" />
        <Heading textAlign="center">
          Il semblerait qu’il y ait un problème
        </Heading>
      </VStack>
    </Container>
  );
}

export default Error;
