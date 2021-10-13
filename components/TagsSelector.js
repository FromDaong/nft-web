import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";

const TagsSelector = ({ selectedTags, setSelectedTags }) => {
  const tags = [
    "SFW",
    "NSFW",
    "Artistic",
    "Glamour",
    "Cosplay",
    "Natural",
    "Solo",
    "Boy - girl",
    "Girl - girl",
    "Boy - boy",
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
          className="mb-2 mr-2"
          type="checkbox"
          variant="outline-primary"
          className="toggle-button"
          checked={selectedTags.indexOf(tag) > -1}
          value="1"
          onChange={(e) => setChecked(e.currentTarget.checked, tag)}
        >
          {tag}
        </ToggleButton>
      ))}
    </div>
  );
};

export default TagsSelector;
