import {useEffect, useState} from "react";

import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import {Button} from "@packages/shared/components/Button";

const CreatingNFTItemPreview = ({
	data,
	imageUrl,
	buttonLabel,
	buttonFunction,
	isOwner,
	price,
	name,
	owner,
	quantity,
	modelData,
}: {
	data?: any;
	imageUrl: any;
	buttonLabel?: any;
	buttonFunction?: any;
	isOwner: any;
	price?: any;
	name: any;
	owner?: any;
	quantity: any;
	modelData: any;
}) => {
	const [image, setBase64Image] = useState();

	useEffect(() => {
		(async () => {
			// if (data.image) {
			//   fetch(data.image)
			//     .then((r) => r.text())
			//     .then((blob) => {
			//       setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
			//     });
			// }
		})();
	}, [data]);

	return (
		<>
			<div className="nft-card m-0">
				<div className="totw-tag-wrapper">
					{isOwner ? (
						<div className="totw-tag">MY NFT</div>
					) : (
						data.totw && <div className="totw-tag">TOTW</div>
					)}
					{quantity > 1 && (
						<div className="quantity-wrapper totw-tag">
							{quantity}x Available
						</div>
					)}
				</div>
				<Link href={`/creator/${modelData.username}`}>
					<a>
						<div
							className="profile-pic"
							style={{backgroundImage: `url(${modelData.profile_pic})`}}
						/>
					</a>
				</Link>
				<div className="img-container text-center text-lg-left d-flex justify-content-center align-items-center">
					<div
						style={{
							position: "absolute",
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Spinner
							animation="border"
							role="status"
							className="mt-5 mb-5"
							variant="light"
						>
							<span className="sr-only">Loading...</span>
						</Spinner>
					</div>
					<div
						style={{
							background: `url(${imageUrl})`,
							backgroundColor: "#333",
							zIndex: 100,
						}}
						className="dynamic-image"
					/>
				</div>
				<div className="text-container container">
					<div className="title-section">
						<div className="title">{name}</div>
						<div className="name">
							{modelData.username && <b>Creator: </b>}
							{modelData.username}
						</div>
						{owner && (
							<div className="name">
								<b>Owner: </b>
								{owner.slice(0, 6) + "..." + owner.slice(-6)}
							</div>
						)}
					</div>
					{price && (
						<div className="stats">
							<div className="stat">
								<div className="number">{price}</div>
								<div className="label">BNB</div>
							</div>
						</div>
					)}
				</div>
				{buttonLabel && buttonFunction && (
					<div className="row">
						<div className="col-lg-12 mt-3">
							<span className="d-inline-block w-100">
								<Button
									className="w-100"
									onClick={buttonFunction}
									appearance={"success"}
								>
									<b className="d-flex align-items-center justify-content-center">
										{buttonLabel}
									</b>
								</Button>
							</span>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CreatingNFTItemPreview;
