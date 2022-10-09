import { ReactNode } from "react";

type StackProps = {
  gap?: number;
  children: ReactNode;
  className?: string;
};

export function YStack({ gap, children, className }: StackProps) {
  return (
    <div className={`flex flex-col gap-${gap ? gap : "8"} ${className}`}>
      {children}
    </div>
  );
}

export function HStack({ gap, children, className }: StackProps) {
  return (
    <div
      className={`flex flex-row flex-wrap gap-${gap ? gap : "8"} ${className}`}
    >
      {children}
    </div>
  );
}

export function HStackScroll({ gap, children, className }: StackProps) {
  return (
    <div
      className={`flex flex-row flex-nowrap overflow-x-scroll relative w-full gap-${
        gap ? gap : "8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
