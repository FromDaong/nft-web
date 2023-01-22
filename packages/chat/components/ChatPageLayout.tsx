import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {ReactNode, useEffect, useState} from "react";
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
			className="grid max-w-5xl grid-cols-1 gap-16 mx-auto overflow-hidden "
			css={{
				height: "calc(100vh - 120px)",
				width: "100%",
				marginTop: "16px",
				borderColor: "$border",
				borderRadius: "16px",
				backgroundColor: "$surface",
			}}
		>
			<Container className="flex overflow-hidden">
				<Container
					className={` flex-col min-w-[360px] flex-1 ${
						hideListInMobile ? "hidden lg:flex" : "flex"
					}`}
				>
					<Container className="px-8 py-4">
						<Heading size="sm">Messages</Heading>
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
					className="flex flex-col px-4 py-2 md:py-0 md:px-8 fixed h-[90vh]
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
