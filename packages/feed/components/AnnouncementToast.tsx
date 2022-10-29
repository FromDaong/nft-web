import { ReactNode } from "react";
import {Tria} from "@radix-ui/react-icons"

const ErrorIcon = () => (
    <></>
)

const SuccessIcon = () => (
    <></>
)

const InfoIcon = () => (
    <></>
)

const WarningIcon = () => (
    <></>
)

const ToastIcon = ({ type }: { type: "error" | "success" | "info" | "warning" }) => {
    switch (type) {
        case "error":
            return <ErrorIcon />
        case "success":
            return <SuccessIcon />
        case "info":
            return <InfoIcon />
        case "warning":
            return <WarningIcon />
        default:
            return null
    }
}

export default function AnnouncementToast({
  icon,
  text,
  status,
}: {
  icon: ReactNode;
  text: string;
  status: "success" | "error" | "info" | "warning";
}) {
  return (
    <div className="fixed p-4">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="p-2 bg-purple-100 rounded-full">
            <ToastIcon type={status} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-400 capitalize">{status}</p>

          <p className="text-sm font-medium text-gray-900">{text}</p>
        </div>
      </div>
    </div>
  );
}
