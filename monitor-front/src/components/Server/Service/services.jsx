import {
  Box,
  Grid,
  GridItem,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useCmdServer,
  useCurrentServer,
} from "../../../providers/Server/hooks";
import ServiceComponent from ".";

function Services() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "services");
  const services = data;

  const [nameFilter, setNameFilter] = useState("");
  const handleNameFilter = (event) => setNameFilter(event.target.value);
  return (
    <Stack spacing={4}>
      <Box>
        <Input
          type="text"
          placeholder="nom du service"
          value={nameFilter}
          onChange={handleNameFilter}
        />
      </Box>
      <>
        {services ? (
          services.length > 0 ? (
            <Grid gap="3" templateColumns="repeat(4, 1fr)">
              {services
                .filter((service) => {
                  //console.log(service.name.includes(nameFilter));
                  return service.name.includes(nameFilter);
                })
                .map((service, index) => (
                  <GridItem key={`service-${index}`}>
                    <ServiceComponent data={service} />
                  </GridItem>
                ))}
            </Grid>
          ) : (
            <Text>Aucun service n'est visible</Text>
          )
        ) : (
          <Spinner />
        )}
      </>
    </Stack>
  );
}

export default Services;
