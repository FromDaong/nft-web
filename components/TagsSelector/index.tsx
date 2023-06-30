import {styled} from "@styles/theme";
import ToggleButton from "react-bootstrap/ToggleButton";

const TagButton = styled(ToggleButton, {
	borderColor: "$subtleBorder",
	color: "$text",
});

const TagsSelector = ({selectedTags, setSelectedTags}) => {
	const tags = [
		"SFW",
		"NSFW",
		"Artistic",
		"Glamour",
		"Cosplay",
		"Natural",
		"Solo",
		"Man - Woman",
		"Woman - Woman",
		"Man - Man",
		"Group",
		"Lingerie",
		"BDSM",
		"Latex",
		"Pantyhose",
		"Feet",
		"Pregnant",
		"Smoking",
		"Femdom",
		"Findom",
		"Flexible",
		"Outdoor",
		"Oil",
		"Masturbation",
		"Anal",
		"Pegging",
		"Toys",
		"Exclusive",
	];

	// const [selectedTags, setSelectedTags] = useState([]);
	// const [checked, setChecked] = useState([]);

	const setChecked = (checked, tag) => {
		const tags = [...selectedTags];

		if (checked) {
			tags.push(tag);
		} else {
			tags.splice(tags.indexOf(tag), 1);
		}

		setSelectedTags(tags);
	};

	return (
		<div className="flex flex-wrap gap-2 ">
			{tags.map((tag) => (
				<TagButton
					className="border-2 rounded-xl p-1 flex gap-2 items-center"
					type="checkbox"
					checked={selectedTags.indexOf(tag) > -1}
					value="1"
					key={tag}
					onChange={(e) => setChecked(e.currentTarget.checked, tag)}
				>
					{tag}
				</TagButton>
			))}
		</div>
	);
};

export default TagsSelector;
