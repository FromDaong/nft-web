/* eslint-disable no-mixed-spaces-and-tabs */
import uploadcareClient from "@utils/uploadcare";
import axios from "axios";
import {File} from "filepond";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {Dispatch, SetStateAction, useCallback} from "react";

export function useToggle(
	defaultValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
	const [value, setValue] = useState(!!defaultValue);

	const toggle = useCallback(() => setValue((x) => !x), []);

	return [value, toggle, setValue];
}

export const useStorageService = () => {
	const uploadFile = async (file: File): Promise<any> => {
		try {
			const formData = new FormData();
			formData.append("file", file.file);

			const cdn = await uploadcareClient.uploadFile(file.file);

			return cdn.cdnUrl;
		} catch (err) {
			console.log(err);

			return {
				error: true,
				message: err.message,
			};
		}
	};

	const uploadToIPFS = async (file: File): Promise<any> => {
		const formData = new FormData();
		formData.append("file", file.file);

		const ipfs = await axios.post(
			"https://api.pinata.cloud/pinning/pinFileToIPFS",
			formData,
			{
				headers: {
					"Content-Type": `multipart/form-data`,
					pinata_api_key: "b949556813c4f284c550",
					pinata_secret_api_key:
						"7a7b755c9c067dedb142c2cb9e9c077aebf561b552c440bf67b87331bac32939",
				},
			}
		);

		return `https://treatdao.mypinata.cloud/ipfs/${ipfs.data.IpfsHash}`;
	};

	return {
		uploadFile,
		uploadToIPFS,
	};
};

const exitFullScreen = () => {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document["mozCancelFullScreen"]) {
		document["mozCancelFullScreen"]();
	} else if (document["webkitExitFullscreen"]) {
		document["webkitExitFullscreen"]();
	} else if (document["msExitFullscreen"]) {
		document["msExitFullscreen"]();
	}
};

export const useFullScreen = (
	elementOrElementId: HTMLElement | string,
	showFullScreen: boolean
) =>
	useEffect(() => {
		const fullScreenElement =
			document["fullscreenElement"] ||
			document["webkitFullscreenElement"] ||
			document["mozFullScreenElement"] ||
			document["msFullscreenElement"];

		// exit full screen
		if (!showFullScreen) {
			if (fullScreenElement) {
				exitFullScreen();
			}
			return;
		}

		// get the element to make full screen
		const element =
			typeof elementOrElementId === "string"
				? document.getElementById(elementOrElementId)
				: elementOrElementId;

		// if the current element is not already full screen, make it full screen
		if (!fullScreenElement) {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element["mozRequestFullScreen"]) {
				element["mozRequestFullScreen"]();
			} else if (element["webkitRequestFullscreen"]) {
				// @ts-ignore
				element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (element["msRequestFullscreen"]) {
				element["msRequestFullscreen"]();
			}
		}
	}, [showFullScreen, elementOrElementId]);

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
	const [copiedText, setCopiedText] = useState<CopiedValue>(null);

	const copy: CopyFn = async (text) => {
		if (!navigator?.clipboard) {
			console.warn("Clipboard not supported");
			return false;
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			await navigator.clipboard.writeText(text);
			setCopiedText(text);
			return true;
		} catch (error) {
			console.warn("Copy failed", error);
			setCopiedText(null);
			return false;
		}
	};

	return [copiedText, copy];
}

export function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
