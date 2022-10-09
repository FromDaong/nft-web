type CommandbarResults = {
  label: string;
};

export default function CommandbarResults({ label }: CommandbarResults) {
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-900/10">
      <div className="pr-4"></div>
      <p className="text-sm text-gray-900/40">{label}</p>
    </div>
  );
}
