import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import React from "react";
import {Button} from "./Button";
import {ImportantText, Text} from "./Typography/Text";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	content: string;
	action?: () => void;
	actionLabel?: string;
};

const Toast = (props: Props) => {
	return (
		<ToastPrimitive.Provider>
			<ToastPrimitive.Root
				open={props.isOpen}
				onOpenChange={props.onClose}
				className={cx(
					"z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
					"bg-white",
					"radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
					"radix-state-closed:animate-toast-hide",
					"radix-swipe-end:animate-toast-swipe-out",
					"translate-x-radix-toast-swipe-move-x",
					"radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
					"focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
				)}
			>
				<div className="flex">
					<div className="flex items-center flex-1 w-0 py-4 pl-5">
						<div className="w-full radix">
							<ToastPrimitive.Title className="text-sm font-medium">
								<Text>
									<ImportantText>{props.title}</ImportantText>
								</Text>
							</ToastPrimitive.Title>
							<ToastPrimitive.Description className="mt-1 text-sm">
								<Text>{props.content}</Text>
							</ToastPrimitive.Description>
						</div>
					</div>
					<div className="flex">
						<div className="flex flex-col px-3 py-2 space-y-1">
							{props.action && (
								<div className="flex flex-1 h-0">
									<ToastPrimitive.Action
										altText="view now"
										onClick={props.action}
									>
										<Button appearance={"subtle"}>{props.actionLabel}</Button>
									</ToastPrimitive.Action>
								</div>
							)}
							<div className="flex flex-1 h-0">
								<ToastPrimitive.Close className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium border border-transparent rounded-lg">
									<Button appearance={"action"}>Dismiss</Button>
								</ToastPrimitive.Close>
							</div>
						</div>
					</div>
				</div>
			</ToastPrimitive.Root>

			<ToastPrimitive.Viewport />
		</ToastPrimitive.Provider>
	);
};

export default Toast;
