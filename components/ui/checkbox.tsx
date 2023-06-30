"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import {cn} from "@lib/utils";
import {CheckIcon} from "@heroicons/react/outline";
import {styled} from "@styles/theme";

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
	borderColor: "$subtleBorder",
});

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
	<CheckboxRoot
		ref={ref}
		className={cn(
			"border-2 h-5 w-5 rounded-md data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center text-current")}
		>
			<CheckIcon className="w-4 h-4 text-white" />
		</CheckboxPrimitive.Indicator>
	</CheckboxRoot>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
