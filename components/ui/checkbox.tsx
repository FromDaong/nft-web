"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import {cn} from "@lib/utils";
import {CheckIcon} from "@heroicons/react/outline";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
	<CheckboxPrimitive.Root
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
			<CheckIcon className="h-4 w-4 text-white" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
