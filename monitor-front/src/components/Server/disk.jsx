import {
  Box,
  Grid,
  GridItem,
  Heading,
  Progress,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useCurrentServer } from "../../hooks/Server";
import { useCmdServer } from "../../providers/Server/hooks";

function DiskComponent() {
  const { currentServer } = useCurrentServer();
  const { data } = useCmdServer(currentServer.id, "disk");
  const disks = data;

  return (
    <Box>
      <Heading size="sm">Disk</Heading>
      <Grid>
        {disks ? (
          disks.map((disk, id) => (
            <GridItem key={`disk-${id}`}>
              <Text>{`${disk.mounted} (${disk.size})`}</Text>
              <Progress value={disk.used} />
            </GridItem>
          ))
        ) : (
          <Spinner />
        )}
      </Grid>
    </Box>
  );
}
export default DiskComponent;
