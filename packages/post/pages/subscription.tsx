import FileUploadPreview from "@packages/form/FileUploadPreview";
import { Container } from "@packages/shared/components/Container";
import { ImportantText } from "@packages/shared/components/Typography/Text";
import { styled } from "@styles/theme";
import { Field, Form, Formik } from "formik";
import { ReactNode, useRef, useState } from "react";
import { CreatePostLayout } from "../layouts/CreatePostLayout";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageFilter from "filepond-plugin-image-filter";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import { create } from "@packages/photo-editor/lib/doka.esm.min";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageFilter,
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginImageTransform
);

const FieldInput = styled(Field, {
  border: "1px solid $subtleBorder",
  borderRadius: "8px",
  padding: "8px 12px",
  marginTop: "8px",
  width: "100%",
});

const FormLabel = ({ children }: { children: ReactNode }) => {
  return (
    <Container>
      <label htmlFor="firstName">
        <ImportantText>{children}</ImportantText>
      </label>
    </Container>
  );
};

const FormContainer = ({ children }: { children: ReactNode }) => (
  <Container className="mb-8 max-w-xl">{children}</Container>
);

const FilepondInput = (props: {
  ref: any;
  name?: string;
  onupdatefiles?: any;
  allowMultiple?: boolean;
  maxFiles?: number;
}) => {
  return (
    <Container className="w-full my-2">
      <FilePond
        allowMultiple={props.allowMultiple}
        maxFiles={props.allowMultiple ? props.maxFiles : 1}
        {...props}
        onupdatefiles={props.onupdatefiles}
        imageCropAspectRatio="1:1"
        imageEditEditor={
          //@ts-ignore
          create({
            cropAspectRatioOptions: [
              {
                label: "Free",
                value: null,
              },
              {
                label: "Portrait",
                value: 1.25,
              },
              {
                label: "Square",
                value: 1,
              },
              {
                label: "Landscape",
                value: 0.75,
              },
            ],
          })
        }
      />
    </Container>
  );
};

const useFileUpload = () => {
  const [files, setFiles] = useState([]);

  const updateFiles = (fileItems) => {
    setFiles(fileItems.map((fileItem) => fileItem.file));
  };

  return {
    files,
    updateFiles,
  };
};

export default function CreateSubscriptionContentPage() {
  const filepondRef = useRef();
  const { updateFiles, files } = useFileUpload();

  return (
    <Container>
      <CreatePostLayout
        heading={"Create Post"}
        description={
          "Complete your post details. This post will be accessible to anyone who is subscribed to your creators profile."
        }
      >
        <Container className="w-full">
          <Formik>
            <Form>
              <FormContainer>
                <FormLabel>Post caption</FormLabel>
                <FieldInput id="caption" name="caption" />
              </FormContainer>
              <FormContainer>
                <FormLabel>Media</FormLabel>
                <FilepondInput
                  allowMultiple={false}
                  onupdatefiles={updateFiles}
                  ref={filepondRef}
                />
              </FormContainer>
            </Form>
          </Formik>
        </Container>
      </CreatePostLayout>
    </Container>
  );
}
