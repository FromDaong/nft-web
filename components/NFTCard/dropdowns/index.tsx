// HeadlessUI reusable dropdown menu component that takes {label: string; icon: ReactNode; action: () => void}

import {Portal, Transition} from "@headlessui/react";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {MoreHorizontalIcon} from "lucide-react";
import {ReactNode, useState} from "react";

export const NFTCardDropdownMenu = (props: {
	actions: {label: string; icon: ReactNode; action: () => void}[];
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleAction = (action: () => void) => {
		action();
		setIsOpen(false);
	};

	return (
		<DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
			<DropdownMenuTrigger>
				<MoreHorizontalIcon className="w-5 h-5" />
			</DropdownMenuTrigger>
			<Transition
				show={isOpen}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Portal>
					<DropdownMenuContent className="z-50 w-64 p-2 bg-white drop-shadow-xl rounded-xl">
						{props.actions.map((action) => (
							<DropdownMenuItem
								key={action.label}
								onClick={() => handleAction(action.action)}
								className="flex items-center p-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-zinc-100"
							>
								{action.icon && <Text className="mr-4">{action.icon}</Text>}
								<Text>
									<ImportantText>{action.label}</ImportantText>
								</Text>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</Portal>
			</Transition>
		</DropdownMenu>
	);
};
