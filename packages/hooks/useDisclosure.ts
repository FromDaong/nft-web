import { useState } from "react";

export default function useDisclosure() {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
