import {XCircleIcon, XIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Overlay} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {SmallText} from "@packages/shared/components/Typography/Text";

export default function FollowersModal({isOpen, onClose}) {
	return (
		<Overlay>
			<Container
				variant={"unstyled"}
				className="fixed max-w-lg drop-shadow-xl"
				css={{
					zIndex: 500,
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: "$surface",
					width: "520px",
					borderRadius: "15px",
				}}
			>
				<Container
					css={{
						padding: "12px",
						position: "relative",
						display: "flex",
						alignItems: "center",
						gap: "16px",
						borderBottom: "1px solid $subtleBorder",
					}}
				>
					<Button outlined>
						Following
						<SmallText>35</SmallText>
					</Button>

					<Button outlined>Followers</Button>

					<Button outlined>Collectors</Button>
					<div className="absolute p-2 bg-gray-200 rounded-full top-4 right-4 ">
						<XIcon className="w-6 h-6" />
					</div>
				</Container>
				<Container></Container>
			</Container>
		</Overlay>
	);
}
