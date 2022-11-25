import { SearchIcon } from "@heroicons/react/outline";
import { useCommandbar } from "..";

export default function SearchTrigger(props: { trigger: string }) {
  const { Commandbar, onOpen } = useCommandbar();
  return (
    <>
      {Commandbar}
      <button onClick={onOpen} className="p-2 border-2 rounded-full">
        <SearchIcon className="w-5 h-5" />
      </button>
    </>
  );
}
