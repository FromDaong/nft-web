import { Text } from "@packages/shared/components/Typography/Text";
import { styled } from "@styles/theme";
import CommandbarResults from "./Results";
import CommandbarSearch from "./Search";

const CommandbarOverlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "$overlayContrast",
});

export default function CommandbarFrame({ onClose }: { onClose: () => void }) {
  return (
    <>
      <CommandbarOverlay
        className="backdrop-blur-sm"
        style={{ zIndex: 1000 }}
        onClick={onClose}
      />
      <div
        className="fixed w-full max-w-xl bg-white border divide-y rounded-xl shadow-xl"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
        }}
      >
        <div className="">
          <div className="w-full p-1" id="searchbar">
            <CommandbarSearch />
          </div>
          <div className="flex flex-col w-full gap-2 p-4" id="results">
            <Text>Content</Text>
            <CommandbarResults label="Content" />
            <Text>Creators</Text>
            <CommandbarResults label="Creators" />
            <Text>Commands</Text>
            <CommandbarResults label="Commands" />
          </div>
        </div>
      </div>
    </>
  );
}
