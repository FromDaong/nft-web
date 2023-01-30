import {PencilAltIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ReactNode} from "react";
import ChatListItem from "./ChatListItem";

export default function ChatPageLayout({
	children,
	hideListInMobile,
}: {
	children?: ReactNode;
	hideListInMobile?: boolean;
}) {
	return (
		<Container
			className="grid max-w-5xl grid-cols-1 gap-16 mx-auto overflow-hidden border"
			css={{
				height: "calc(100vh - 120px)",
				width: "100%",
				marginTop: "16px",
				borderColor: "$border",
				borderRadius: "16px",
				backgroundColor: "$surface",
			}}
		>
			<Container className="flex overflow-hidden divide-x">
				<Container
					className={` flex-col min-w-[360px] flex-1 ${
						hideListInMobile ? "hidden lg:flex" : "flex"
					}`}
				>
					<Container
						className="px-8 flex justify-between items-center h-[64px] border-b"
						css={{borderColor: "$border"}}
					>
						<Heading size="xss">@kamfeskaya</Heading>
						<Button
							css={{borderRadius: "9999px", padding: "8px"}}
							appearance={"surface"}
						>
							<PencilAltIcon
								height={20}
								width={20}
							/>
						</Button>
					</Container>
					<Container className="flex-col gap-2 p-2 ">
						<ChatListItem
							participant={{
								_id: "hdhdshjd",
								display_name: "tatenda bako",
								username: "tatenda",
							}}
							lastMessage={{
								timestamp: new Date().getTime(),
								text: "I didnt know this would work or even think it would",
								sender: {
									_id: "hdhdshjd",
									display_name: "tatenda bako",
									username: "tatenda",
								},
							}}
							id={"930892hfh2983fy89"}
							isSelected
						/>
						<ChatListItem
							participant={{
								_id: "hdhdshjd",
								display_name: "engineer",
								username: "kamfeskaya",
							}}
							lastMessage={{
								timestamp: new Date().getTime(),
								text: "I didnt know this would work or even think it would",
								sender: {
									_id: "hdhdshjd",
									display_name: "tatenda bako",
									username: "tatenda",
								},
							}}
							id={"930892hfh2983fy89"}
						/>
						<ChatListItem
							participant={{
								_id: "hdhdshjd",
								display_name: "developer",
								username: "developer",
							}}
							lastMessage={{
								timestamp: new Date().getTime(),
								text: "I didnt know this would work or even think it would",
								sender: {
									_id: "hdhdshjd",
									display_name: "tatenda bako",
									username: "tatenda",
								},
							}}
							id={"930892hfh2983fy89"}
						/>
						<ChatListItem
							participant={{
								_id: "hdhdshjd",
								display_name: "Andi Lane",
								username: "Andi",
							}}
							lastMessage={{
								timestamp: new Date().getTime(),
								text: "I didnt know this would work or even think it would",
								sender: {
									_id: "hdhdshjd",
									display_name: "tatenda bako",
									username: "tatenda",
								},
							}}
							id={"930892hfh2983fy89"}
						/>
					</Container>
				</Container>
				<Container
					className="flex flex-col fixed h-[90vh]
                    ] w-screen top-0 left-0 z-50 lg:z-0 md:w-full md:h-full md:relative"
					css={{
						borderColor: "$border",
						backgroundColor: "$surface",
					}}
				>
					{children}
				</Container>
			</Container>
		</Container>
	);
}
