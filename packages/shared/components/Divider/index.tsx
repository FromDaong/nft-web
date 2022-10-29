export const ShortDivider = ({ dir }: { dir: "vertical" | "horizontal" }) => {
  return (
    <div className="w-full py-8">
      <div
        className={`${
          dir === "horizontal"
            ? "h-24 my-auto border-l-2"
            : "w-24 mx-auto border-t-2"
        }`}
      />
    </div>
  );
};
