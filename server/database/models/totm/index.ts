const TOTM = {
	createdAt: {
		type: "number",
		default: new Date().getTime(),
	},
	username: {
		type: "string",
		required: true,
	},
	totm_id: {
		type: "string",
	},
	is_totm: {
		type: "relationship",
		relationship: "IS_TOTM",
		direction: "out",
		properties: {
			validUntil: {
				type: "number",
				default: () => new Date().getTime(),
			},
		},
	},
};

export default TOTM;
