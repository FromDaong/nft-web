/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {useEffect, useState} from "react";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateSize,
	FilePondPluginFileValidateType
);

const UploadMedia = ({setFile}) => {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		setFile(files[0] ?? null);
	}, [files]);

	return (
		<Container className="flex flex-col w-full gap-8 p-2">
			<Container className="flex flex-col gap-4">
				<Container className="flex flex-col gap-2">
					<Heading size="xss">Add NFT media</Heading>
					<Text>
						Upload your image file here. Accepted formats are JPG, PNG, JPEG,
						GIF
					</Text>
				</Container>
				<FilePond
					files={files}
					onupdatefiles={setFiles}
					allowMultiple={true}
					instantUpload={false}
					name="files"
					maxFileSize={"100MB"}
					maxFiles={1}
					labelMaxFileSizeExceeded="File is too large"
					labelMaxFileSize="Maximum file size is {filesize}"
					labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
					fileValidateTypeDetectType={(source, type) =>
						new Promise((resolve, reject) => {
							// Detect image or video and resolve promise
							if (type.startsWith("image/")) {
								resolve(type);
							} else if (type.startsWith("video/")) {
								reject(type);
							} else {
								reject(type);
							}
						})
					}
					acceptedFileTypes={[
						"image/png",
						"image/jpeg",
						"image/jpg",
						"image/gif",
						"video/mp4",
					]}
					labelFileTypeNotAllowed="Only image and video files are allowed"
				/>
			</Container>
		</Container>
	);
};

export default UploadMedia;
