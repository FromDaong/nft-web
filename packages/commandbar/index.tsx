import { useDisclosure } from "packages/hooks";
import CommandbarFrame from "./components/Frame";

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

export default function Commandbar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return <>{isOpen ? <CommandbarBase onClose={onClose} /> : null}</>;
}
