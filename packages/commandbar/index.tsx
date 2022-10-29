import { useEffect } from "react";
import { useDisclosure } from "../hooks";
import CommandbarFrame from "./components/Frame";

export type CommandbarProps = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
};

export function UniversalCommandbar() {
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

  return (
    <>
      <Commandbar isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export function CommandbarBase({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative top-0 z-50">
      <CommandbarFrame onClose={onClose} />
    </div>
  );
}

export default function Commandbar({ isOpen, onClose }: CommandbarProps) {
  return <>{isOpen ? <CommandbarBase onClose={onClose} /> : null}</>;
}
