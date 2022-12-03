import {Container} from "../../Container";
import {Text} from "../../Typography/Text";
import Avatar from "../../AvatarNew";
import {ImportantSmallText} from "../../Typography/Headings";
import {MutedText} from "../../Typography/Text";
import {Heading} from "../../Typography/Headings";

export default function TreatOfTheMonthThumbnail({images}) {
	return (
		<Container
			className="grid grid-cols-3 gap-2 p-4 border"
			style={{
				height: "420px",
				width: "100%",
				borderColor: "$subtleBorder",
				borderRadius: "16px",
			}}
		>
			{images &&
				images.slice(1, 7).map((item) => (
					<Container
						key={item}
						className="overflow-hidden rounded-xl "
					>
						<img
							src={item}
							width="100%"
							height="100%"
						/>
					</Container>
				))}
			<Container className="col-span-3">
				<Container className="grid grid-cols-2 gap-4 ">
					<Container className="flex items-center gap-2 p-2">
						<Avatar
							size={{width: "40px", height: "40px"}}
							imageSrc="elvin"
							name="ane"
						/>
						<Container className="grid grid-cols-1">
							<p>
								<ImportantSmallText>Trick or Treat 2022</ImportantSmallText>
							</p>
							<p>
								<MutedText>treat_dao</MutedText>
							</p>
						</Container>
					</Container>
					<Container className="flex items-center justify-end gap-2 p-2">
						<p>
							<Heading size="xs">0 BNB</Heading>
						</p>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
