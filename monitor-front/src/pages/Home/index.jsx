import { Container, Grid, GridItem, Show } from "@chakra-ui/react";
import DefaultHome from "./default";
import { useCurrentServer, useServer } from "../../providers/Server/hooks";
import ServerHome from "./Server/detail";
import { Nav } from "../../components/Nav";
import Error from "../../components/Error";

function Home() {
  const { currentServer } = useCurrentServer();
  const { error } = useServer();
  return (
    <>
      {!error ? (
        <Container maxW="container.lg">
          <Grid
            templateAreas={{ base: `"main"`, md: `"nav main"` }}
            gridTemplateColumns={{ base: "1fr", md: "1fr 2.5fr" }}
            gap="4"
          >
            <Show above="md">
              <GridItem
                pl="2"
                area={"nav"}
                pos="sticky"
                top="4rem"
                width="100%"
                height="calc(100vh - 8.125rem)"
                overflowY="auto"
              >
                <Nav />
              </GridItem>
            </Show>
            <GridItem pl="2" area={"main"}>
              {currentServer ? <ServerHome /> : <DefaultHome />}
            </GridItem>
          </Grid>
        </Container>
      ) : (
        <Error error={error} />
      )}
    </>
  );
}

export default Home;
