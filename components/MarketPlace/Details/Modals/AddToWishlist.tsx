import React from "react";
import {NFTPageModal} from ".";

export default function AddToWishlist({isOpen, onClose}) {
	return (
		<NFTPageModal
			isOpen={isOpen}
			onClose={onClose}
			title="Add to Wishlist"
		>
			<></>
		</NFTPageModal>
	);
}
