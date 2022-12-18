import {createContext, ReactNode} from "react";

const IkarosContext = createContext({
	profile: {},
	creatorProfile: {},
	session: {},
	connection: {
		isConnected: false,
		deviceType: "",
		fingerprint: "",
	},
	isConnected: false,
	store: {},
});

export default function IkarosProvider(props: {
	children: ReactNode;
	config: object;
}) {
	return <>{props.children}</>;
}
