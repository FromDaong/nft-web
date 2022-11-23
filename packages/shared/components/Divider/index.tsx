import { styled } from "@styles/theme";

const StraightLine = styled("div", {
  borderColor: "$subtleBorder",
});

export const ShortDivider = ({ dir }: { dir: "vertical" | "horizontal" }) => {
  return (
    <div className="w-full py-8">
      <StraightLine
        className={`${
          dir === "horizontal"
            ? "h-24 my-auto border-l-2"
            : "w-24 mx-auto border-t-2"
        }`}
      />
    </div>
  );
};

export const Divider = ({ dir }: { dir: "vertical" | "horizontal" }) => {
  return (
    <div className="w-full my-2">
      <StraightLine
        className={`${
          dir === "horizontal"
            ? "w-full my-auto border-t my-8"
            : "w-full mx-auto border-t"
        }`}
      />
    </div>
  );
};
