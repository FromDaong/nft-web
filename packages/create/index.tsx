import {CurrencyDollarIcon, LockClosedIcon} from "@heroicons/react/outline";
import CreateOptionCard from "./CreateOptionCard";

export const types_of_posts = [
	/*{
    title: "Subscription content",
    description:
      "Create content that can only be accessed by people who have subscribed to your profile.",
    url: "/create/subscription",
    icon: <LockClosedIcon className="w-12 h-12" />,
  },*/
	{
		title: "Treat collectible",
		description:
			"Create video, music and picture collectibles and list them on the Treat Marketplace. ",
		url: "/create/collectible",
		icon: <CurrencyDollarIcon className="w-12 h-12" />,
	},
];

export default function CreateOptions() {
	return (
		<div className="flex flex-col gap-y-4">
			{types_of_posts.map((c) => (
				<CreateOptionCard
					key={c.url}
					{...c}
				/>
			))}
		</div>
	);
}
