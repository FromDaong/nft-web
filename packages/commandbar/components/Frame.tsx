import CommandbarFooter from "./Footer";
import CommandbarResults from "./Results";
import CommandbarSearch from "./Search";

export default function CommandbarFrame({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        className="fixed z-40 w-screen h-screen bg-gray-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed z-50 w-full max-w-xl bg-white border divide-y rounded-xl drop-shadow-lg border-gray-900/30 divide-gray-900/10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="">
          <div className="w-full p-1" id="searchbar">
            <CommandbarSearch />
          </div>
          <div className="flex flex-col w-full gap-2 p-4" id="results">
            <h6 className="text-sm text-gray-900/40">Content</h6>
            <CommandbarResults label="Content" />
            <h6 className="text-sm text-gray-900/40">Creators</h6>
            <CommandbarResults label="Creators" />
            <h6 className="text-sm text-gray-900/40">Commands</h6>
            <CommandbarResults label="Commands" />
          </div>
          <div className="w-full p-3 text-sm" id="footer">
            <CommandbarFooter />
          </div>
        </div>
      </div>
    </>
  );
}
