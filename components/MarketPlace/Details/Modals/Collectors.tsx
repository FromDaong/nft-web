import React from "react";
import {NFTPageModal} from ".";

export default function ShowAllCollectors({isOpen, onClose}) {
	return (
		<NFTPageModal
			isOpen={isOpen}
			onClose={onClose}
			title="Owned by"
		>
			<></>
		</NFTPageModal>
	);
}
