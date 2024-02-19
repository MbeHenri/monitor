import {
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { AddServerForm } from "../Forms/AddServerForm";

export function AddIconServer({ color = "secondary", size="xs"}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <>
      <IconButton
        size={size}
        colorScheme={color}
        bgColor={color}
        onClick={onOpen}
        icon={<AddIcon />}
      />
      <AddServerForm
        finalRef={finalRef}
        initialRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}


