import { ApplicationTheme } from "@packages/theme";
import { styled } from "@styles/theme";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useDisclosure } from "../hooks";
import CommandbarFrame from "./components/Frame";

export type CommandbarProps = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
};

export function UniversalCommandbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const theme = useContext(ApplicationTheme);
  // Listen for cmd+k
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

  // Listen for other keys
  useEffect(() => {
    const onKeydown = (e) => {
      // Change themes
      // SHIFT + CMD + D = Dark Mode
      // SHIFT + CMD + L = Light Mode
      // SHIFT + CMD + P = Pink Mode
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        theme.updateTheme("dark");
      } else if (e.key === "l" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        theme.updateTheme("light");
      } else if (e.key === "p" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        theme.updateTheme("pink");
      } else if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/create/");
      } else if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/create/live");
      } else if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/ramp/swap");
      } else if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/discover");
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

export default function Commandbar({ isOpen, onClose }: CommandbarProps) {
  return <>{isOpen ? <CommandbarBase onClose={onClose} /> : null}</>;
}

export function CommandbarBase({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative top-0 z-50">
      <CommandbarFrame onClose={onClose} />
    </div>
  );
}

export const useCommandbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return {
    Commandbar: <Commandbar isOpen={isOpen} onClose={onClose} />,
    isOpen,
    onClose,
    onOpen,
  };
};
