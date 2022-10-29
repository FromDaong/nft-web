import { useEffect } from "react";
import { useDisclosure } from "../hooks";
import CommandbarFrame from "./components/Frame";
import { listenForKeys, removeKeyListener } from "./key_listener";

export type CommandbarProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function NavbarSearchBox() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div id="navbar-search" className="" onClick={onOpen}>
      <Commandbar isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export function CommandbarBase({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative top-0 z-50">
      <CommandbarFrame onClose={onClose} />
    </div>
  );
}

export default function Commandbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return <>{isOpen ? <CommandbarBase onClose={onClose} /> : null}</>;
}
