import {
  Box,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useCmdServer,
  useCurrentServer,
} from "../../../providers/Server/hooks";

function Services() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "services");
  const services = data;

  const [nameFilter, setNameFilter] = useState("");
  const handleNameFilter = (event) => setNameFilter(event.target.value);
  return (
    <Box>
      <Input
        type="text"
        placeholder="nom du service"
        value={nameFilter}
        onChange={handleNameFilter}
      />

      {services ? (
        services.length > 0 ? (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th isTruncated>name</Th>
                  <Th>active</Th>
                  <Th>loaded</Th>
                  <Th>state</Th>
                </Tr>
              </Thead>
              <Tbody>
                {services
                  .filter((service) => service.name.includes(nameFilter))
                  .map((service, index) => (
                    <Tr>
                      <Td>{service.name.length > 7
                          ? service.name.substring(0, 6) + "..."
                          : service.name}</Td>
                      <Td>{service.is_active ? "yes" : "no"}</Td>
                      <Td>{service.is_loaded ? "yes" : "no"}</Td>
                      <Td>{`${service.state}`}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>Aucun service n'est visible</Text>
        )
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default Services;
