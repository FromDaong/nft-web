/* eslint-disable no-mixed-spaces-and-tabs */
import uploadcareClient from "@utils/uploadcare";
import {File} from "filepond";

export const useUploadcare = () => {
	const uploadFile = async (file: File): Promise<any> => {
		try {
			const formData = new FormData();
			formData.append("file", file.file);

			const cdn = await uploadcareClient.uploadFile(file.file);

			return {
				cdn: cdn.cdnUrl,
				type: cdn.isImage ? "image" : "video",
				videoInfo: !cdn.isImage
					? {
							duration: cdn.videoInfo.duration,
							width: cdn.videoInfo.video.width,
							height: cdn.videoInfo.video.height,
					  }
					: null,
			};
		} catch (err) {
			console.log(err);

			return {
				error: true,
				message: err.message,
			};
		}
	};

	return {
		uploadFile,
	};
};
