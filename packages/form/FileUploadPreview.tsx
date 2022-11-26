import { RewindIcon, UploadIcon, XIcon } from "@heroicons/react/outline";
import { Button } from "@packages/shared/components/Button";
import { Container } from "@packages/shared/components/Container";
import {
  ImportantText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Text";

export default function FileUploadPreview({
  filename,
  filesize,
  uploaded_size,
  image,
}: {
  filename: string;
  filesize: number;
  uploaded_size: number;
  image: string;
}) {
  return (
    <Container className="flex items-center gap-4 w-full">
      <Container className="flex flex-1 h-full">
        <UploadComplete filename={filename} filesize={filesize} />
      </Container>
    </Container>
  );
}

const UploadComplete = ({ filename, filesize }) => (
  <Container
    css={{ backgroundColor: "$successBg", borderRadius: "16px" }}
    className="w-full h-full py-2 px-4 flex justify-between"
  >
    <Container>
      <p>
        <ImportantText>
          <SmallText>{filename}</SmallText>
        </ImportantText>
      </p>
      <p>
        <SmallText>{filesize}</SmallText>
      </p>
    </Container>
    <Container className="flex gap-4 items-center">
      <Container>
        <p>
          <ImportantText>
            <SmallText>Upload complete</SmallText>
          </ImportantText>
        </p>
        <p>
          <SmallText>Tap to remove</SmallText>
        </p>
      </Container>
      <Container>
        <XIcon className="w-4 h-4" />
      </Container>
    </Container>
  </Container>
);

const UploadFailed = ({ filename, filesize }) => (
  <Container
    css={{ backgroundColor: "$red9" }}
    className="w-full h-full p-2 flex justify-between"
  >
    <Container>
      <p>
        <ImportantText>
          <SmallText>{filename}</SmallText>
        </ImportantText>
      </p>
      <p>
        <SmallText>{filesize}</SmallText>
      </p>
    </Container>
    <Container className="flex gap-4 items-center">
      <Container>
        <p>
          <ImportantText>
            <SmallText>Upload failed</SmallText>
          </ImportantText>
        </p>
        <p>
          <SmallText>Tap to retry</SmallText>
        </p>
      </Container>
      <Container>
        <RewindIcon className="w-4 h-4" />
      </Container>
    </Container>
  </Container>
);
