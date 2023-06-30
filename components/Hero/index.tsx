import {Heading} from "@packages/shared/components/Typography/Headings";
import React from "react";

const Hero = ({
	title,
	subtitle,
	additionalContent,
	titleClass,
}: {
	title: string;
	subtitle?: string;
	additionalContent?: any;
	titleClass?: string;
}) => {
	return (
		<div className="pink-bg mb-5">
			<Heading
				size={"sm"}
				className={`heading-text p-0 mt-5 ${titleClass}`}
			>
				{title}
			</Heading>
			<p
				className="totw-secondary-text m-0 mt-2 pb-3"
				style={{maxWidth: "none"}}
			>
				{subtitle}
			</p>
			{additionalContent}
		</div>
	);
};

export default Hero;
