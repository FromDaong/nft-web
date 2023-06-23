import ToggleButton from "react-bootstrap/ToggleButton";

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
		<div className="tags-container">
			{tags.map((tag) => (
				<ToggleButton
					className="border-2 border-primary mb-2 mr-2"
					type="checkbox"
					checked={selectedTags.indexOf(tag) > -1}
					value="1"
					key={tag}
					onChange={(e) => setChecked(e.currentTarget.checked, tag)}
				>
					{tag}
				</ToggleButton>
			))}
		</div>
	);
};

export default TagsSelector;
