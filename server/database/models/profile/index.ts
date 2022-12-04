/**
 * Profile Definition
 */
const Profile = {
	profile_id: {
		type: "uuid",
		primary: true,
	},
	username: {
		type: "string",
		index: true,
		unique: true,
	},
	bio: {
		type: "string",
		index: true,
	},
	address: "string",
	follows: {
		type: "relationship",
		relationship: "FOLLOWS",
		direction: "out",
		properties: {
			since: {
				type: "number",
				default: () => new Date().getTime(),
			},
		},
	},
	createdAt: {
		type: "number",
		default: () => new Date().getTime(),
	},
};

export default Profile;
