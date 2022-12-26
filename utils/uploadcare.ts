import {UploadClient} from "@uploadcare/upload-client";

const uploadcareClient = new UploadClient({publicKey: "ab5ca00972ca36a1c9b4"});

export const cdnUploadFileAndReturnURL = async (file: File) => {
	const fileUpload = await uploadcareClient.uploadFile(file);
	return fileUpload.cdnUrl;
};

export default uploadcareClient;
