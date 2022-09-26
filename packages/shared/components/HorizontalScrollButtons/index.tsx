import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

export default function HorizontalScrollButtons() {
  return (
    <div
      style={{
        top: "50%",
        transform: "translateY(-50%)",
      }}
      className="absolute z-20 flex justify-between w-full p-4"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer drop-shadow-2xl">
        <ArrowLeftIcon className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer drop-shadow-2xl">
        <ArrowRightIcon className="w-4 h-4" />
      </div>
    </div>
  );
}
