import { ReactNode } from "react";

export default function Kbd({ children }: { children: ReactNode }) {
  return (
    <p className="px-2 py-1 text-xs font-bold bg-gray-100 rounded-md">
      {children}
    </p>
  );
}

export const ctrl_button_emoji = "⌘";
