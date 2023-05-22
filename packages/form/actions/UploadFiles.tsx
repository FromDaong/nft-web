/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import uploadcareClient from "@utils/uploadcare";
import {useEffect, useState} from "react";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import {File} from "filepond";
import {Button} from "@packages/shared/components/Button";

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateSize,
	FilePondPluginFileValidateType
);

const UploadMedia = ({next: callback}) => {
	const [files, setFiles] = useState([]);
	const [isUploading, setUploading] = useState(false);

	const uploadFiles = () => {
		setUploading(true);
		Promise.all(
			files.map(async (file: File) => {
				try {
					return {
						file,
						// ipfs: `https://treatdao.mypinata.cloud/ipfs/${ipfs.data.IpfsHash}`,
						type: file.fileType.includes("image") ? "image" : "video",
					};
				} catch (err) {
					console.log(err);
				}
			})
		).then((files) => {
			callback(files);
		});
	};

	useEffect(() => {
		setUploading(false);
	}, []);

	return (
		<Container
			className="flex flex-col max-w-2xl gap-8 p-8 shadow-sm"
			css={{background: "$surfaceOnSurface", borderRadius: "16px"}}
		>
			<Container className="flex flex-col gap-4">
				<Container className="flex flex-col gap-2">
					<Heading size="xss">Add media to collection</Heading>
					<Text>
						Add image, or video files here. Accepted formats are JPG, PNG, JPEG,
						GIF & MP4
					</Text>
				</Container>
				<FilePond
					files={files}
					onupdatefiles={setFiles}
					allowMultiple={true}
					instantUpload={false}
					name="files"
					maxFileSize={"100MB"}
					labelMaxFileSizeExceeded="File is too large"
					labelMaxFileSize="Maximum file size is {filesize}"
					labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
					fileValidateTypeDetectType={(source, type) =>
						new Promise((resolve, reject) => {
							// Detect image or video and resolve promise
							if (type.startsWith("image/")) {
								resolve(type);
							} else if (type.startsWith("video/")) {
								resolve(type);
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
			<Container className="flex justify-end">
				<Button
					disabled={isUploading}
					appearance={
						isUploading || files.length === 0 ? "disabled" : "primary"
					}
					onClick={uploadFiles}
				>
					{isUploading ? "Uploading..." : "Save and continue"}
				</Button>
			</Container>
		</Container>
	);
};

export default UploadMedia;
