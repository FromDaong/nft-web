import * as Ava from "@radix-ui/react-avatar";

export default function Avatar({ size }: { size?: number }) {
  return (
    <Ava.Root className={`rounded-full`}>
      <Ava.Image
        className={`object-cover w-${size ? size : 10} h-${
          size ? size : 10
        } rounded-full shadow-md`}
        src="/assets/KristinCover.jpg"
      />
      <Ava.Fallback className="rounded-full shadow-xl ">
        <p
          className={`flex items-center justify-center w-${
            size ? size : 10
          } h-${
            size ? size : 10
          } bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700`}
        >
          TR
        </p>
      </Ava.Fallback>
    </Ava.Root>
  );
}

export function LivestreamingAvatar() {
  return (
    <Ava.Root className="relative rounded-full">
      <div className="absolute z-10 w-4 h-4 bg-red-500 border-white border-2 shadow shadow-red-300 rounded-full bottom-[-1px] right-[-1px]" />
      <Ava.Image
        className="object-cover w-10 h-10 rounded-full shadow-md"
        src="/assets/KristinCover.jpg"
      />
      <Ava.Fallback className="rounded-full shadow-xl ">
        <p className="flex items-center justify-center w-10 h-10 bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700">
          TR
        </p>
      </Ava.Fallback>
    </Ava.Root>
  );
}
