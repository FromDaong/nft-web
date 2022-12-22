import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

export const useUser = () => {
	const {data, status} = useSession();
	const [isConnected, setConnected] = useState(false);

	const profile = (data as any)?.profile;

	const isLoading = status === "loading";

	useEffect(() => {
		if (status === "authenticated") {
			setConnected(true);
		} else {
			setConnected(false);
		}
	}, [status]);

	return {
		isConnected,
		isLoading,
		profile,
	};
};
