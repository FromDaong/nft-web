import { Button } from "@packages/shared/components/Button";

export const FilenameButton = ({ filename }: { filename: string }) => {
  return (
    <button className="px-4 py-2 bg-gray-100 rounded-xl">{filename}</button>
  );
};

export const SaveDraftButton = () => {
  return <button className="px-4 py-2 bg-gray-200 rounded-full"></button>;
};

export const SaveButton = () => {
  return <Button colorScheme="primary">Done</Button>;
};

export const UndoButton = () => {
  return <button className="px-6 py-2 bg-gray-200 rounded-xl"></button>;
};

export const RedoButton = () => {
  return <button className="px-6 py-2 bg-gray-200 rounded-xl"></button>;
};

export const UndoRedoButtonGroup = () => {
  return (
    <div className="flex gap-2">
      <UndoButton />
      <RedoButton />
    </div>
  );
};

export default function ArtworkerToolbar() {
  return (
    <div className="flex justify-between">
      <div className="flex gap-4 lg:gap-8">
        <FilenameButton filename="IMG_983783.jpg" />
      </div>
      <div className="flex gap-4 lg:gap-8">
        <UndoRedoButtonGroup />
        <SaveButton />
      </div>
    </div>
  );
}
