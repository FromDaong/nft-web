import { ShareIcon } from "@heroicons/react/solid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExitIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { Button } from "../Button";

const PreviewMediaFrame = ({ label }: { label: string }) => {
  return (
    <div className="relative flex flex-col w-full h-full gap-8 p-8 text-white">
      <div
        className="absolute flex justify-between w-full p-4"
        id="preview-controls"
      >
        <div className="w-full p-4 border-2 border-white shadow">
          <ArrowLeftIcon className="w-6 h-6" />
        </div>
        <div className="w-full p-4 border-2 border-white shadow">
          <ArrowRightIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex justify-between w-full p-4 py-2">
        <Button className="flex justify-between gap-4 text-white">
          <ExitIcon className="w-6 h-6" />
          <span>Close</span>
        </Button>
        <p></p>
        <div className="flex gap-4">
          <Button className="text-white">
            <ShareIcon className="w-6 h-6" />
          </Button>
          <Button className="text-white">
            <HeartIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="w-full h-full "></div>
      <div className="w-full py-2 text-center">{label}</div>
    </div>
  );
};

export default function MediaPreview() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen transition-opacity duration-100 bg-white">
      <PreviewMediaFrame label="Maybe it’s time to treat yourself" />
    </div>
  );
}
