import {Container} from "@packages/shared/components/Container";
import {NFTCard} from "..";

export default function NFTMediaRenderer({isProtected, isMine, text, _id}) {
	return (
		<Container className="relative flex w-full overflow-hidden aspect-[11/16]">
			<NFTCard.Media
				isProtected={isProtected && !isMine}
				caption={text}
				_id={_id}
			/>
			{isProtected && !isMine && (
				<Container
					className="absolute flex flex-col justify-between w-full h-full p-2 top-2 left-2"
					css={{
						zIndex: 10,
					}}
				>
					<Container className="flex items-center justify-between">
						<Container>{isProtected && <NFTCard.Protected />}</Container>
					</Container>
				</Container>
			)}
		</Container>
	);
}
