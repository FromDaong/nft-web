import NewAvatar from "@packages/shared/components/AvatarNew";
import Avvvatars from "avvvatars-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import {useState} from "react";
import {Portal, Transition} from "@headlessui/react";
import {Text} from "@packages/shared/components/Typography/Text";

export function AvatarWithSuggestCard(props: {
	data?: {
		username: string;
		display_name?: string;
		avatar: string;
		bio?: string;
		followers: Array<string>;
		following: Array<string>;
	};
	size: number;
	username?: string;
	profile_pic?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<HoverCard onOpenChange={setIsOpen}>
			<HoverCardTrigger></HoverCardTrigger>
			<Transition
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
				show={isOpen && props.data?.username === props.username}
			>
				<Portal>
					<HoverCardContent className="z-50 p-4 bg-white shadow-xl rounded-xl w-96">
						<div className="flex flex-col gap-2">
							<UserAvatar
								size={48}
								{...props}
							/>
							<div className="flex flex-col gap-[15px]">
								<div>
									<div className="text-mauve12 m-0 text-[15px] font-medium leading-[1.5]">
										{props.data?.display_name}
									</div>
									<div className="text-mauve10 m-0 text-[15px] leading-[1.5]">
										@{props.data.username}
									</div>
								</div>
								<Text>{props.data.bio}</Text>
								<div className="flex gap-[15px]">
									<div className="flex gap-[5px]">
										<div className="text-mauve12 m-0 text-[15px] font-medium leading-[1.5]">
											{props.data.following.length}
										</div>{" "}
										<div className="text-mauve10 m-0 text-[15px] leading-[1.5]">
											Following
										</div>
									</div>
									<div className="flex gap-[5px]">
										<div className="text-mauve12 m-0 text-[15px] font-medium leading-[1.5]">
											{props.data.followers.length}
										</div>{" "}
										<div className="text-mauve10 m-0 text-[15px] leading-[1.5]">
											Followers
										</div>
									</div>
								</div>
							</div>
						</div>
					</HoverCardContent>
				</Portal>
			</Transition>
		</HoverCard>
	);
}

const UserAvatar = (props: {
	size: number;
	username?: string;
	profile_pic?: string;
}) => {
	return props.profile_pic ? (
		<NewAvatar
			imageSrc={props.profile_pic}
			username={props.username}
			size={props.size}
		/>
	) : (
		<Avvvatars
			size={props.size}
			value={props.profile_pic ?? props.username}
			style={"shape"}
		/>
	);
};

export default UserAvatar;
