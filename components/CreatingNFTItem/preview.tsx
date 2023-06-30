import {useEffect, useState} from "react";

import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";

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
			<div className="w-full">
				<Container
					css={{
						background: `url(${imageUrl})`,
					}}
					className="w-full shadow max-w-96 aspect-square rounded-xl img-container text-center text-lg-left d-flex justify-content-center align-items-center"
				>
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
				</Container>

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
