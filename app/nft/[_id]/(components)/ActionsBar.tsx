import MoreActionsButton from "@packages/post/MoreActionsButton";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	EnterFullScreenIcon,
	HeartFilledIcon,
	HeartIcon,
	Share2Icon,
} from "@radix-ui/react-icons";

const ActionsBar = () => {
	return (
		<Container className="flex flex-wrap col-span-2 gap-4 bottom-4 right-4">
			{props.address && (
				<Button
					appearance={"surface"}
					onClick={postUtils.likeNFT}
				>
					{postUtils.liked ? (
						<>
							<HeartFilledIcon
								width={16}
								height={16}
							/>
						</>
					) : (
						<HeartIcon
							width={16}
							height={16}
						/>
					)}
					<span>{postUtils.likedBy.length}</span>
				</Button>
			)}
			<Button
				onClick={copyUrlToClipboard}
				appearance={"surface"}
			>
				<Share2Icon
					width={16}
					height={16}
				/>
				Copy link
			</Button>
			{false && (
				<Button
					appearance={"surface"}
					onClick={props.openFullScreen}
				>
					<EnterFullScreenIcon
						style={{strokeWidth: "2px"}}
						height={16}
						width={16}
					/>
				</Button>
			)}
			{isOwned && (
				<MoreActionsButton
					nft={props.nft}
					seller={props.seller}
					address={props.address}
					hasOpenOrders={hasOpenOrders}
					numberOfNFTsOwned={numberOfNFTsOwned}
				/>
			)}
		</Container>
	);
};

export default ActionsBar;
