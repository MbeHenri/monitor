import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { useServicesServer } from "../../hooks/Service";
import ServiceComponent from "./service";
import { useState } from "react";

function Services() {
  const { services } = useServicesServer();
  const [nameFilter, setNameFilter] = useState("");
  const handleNameFilter = (event) => setNameFilter(event.target.value);
  return (
    <Stack>
      <Box>
        <Input
          type="text"
          placeholder="nom du service"
          value={nameFilter}
          onChange={handleNameFilter}
        />
      </Box>
      <Stack>
        {services.length > 0 ? (
          services
            .filter((service) => {
              console.log(service.name.includes(nameFilter));
              return service.name.includes(nameFilter);
            })
            .map((service, index) => (
              <ServiceComponent key={`service-${index}`} data={service} />
            ))
        ) : (
          <Text>Aucun service n'est visible</Text>
        )}
      </Stack>
    </Stack>
  );
}

export default Services;
