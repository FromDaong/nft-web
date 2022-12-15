import {BadgeCheckIcon} from "@heroicons/react/outline";
import {BriefcaseIcon} from "@heroicons/react/solid";
import {styled} from "@styles/theme";

const Icon = styled(BadgeCheckIcon, {
	color: "$pink11",
});

const Briefcase = styled(BriefcaseIcon, {
	color: "#da5184",
});

export default function CreatorBadge() {
	return (
		<Icon
			height={16}
			width={16}
		/>
	);
}

export function BriefcaseBadge() {
	return (
		<Briefcase
			height={16}
			width={16}
		/>
	);
}
