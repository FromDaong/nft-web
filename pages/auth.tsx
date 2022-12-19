import {useConnectModal} from "@rainbow-me/rainbowkit";

import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useAccount} from "wagmi";

function Auth() {
	const {isConnected: connected} = useAccount();
	const {status} = useSession();
	const router = useRouter();

	const isConnected = status === "authenticated" && connected;

	const {openConnectModal} = useConnectModal();

	useEffect(() => {
		if (openConnectModal) {
			if (isConnected) {
				router.push("/");
				return;
			}
			openConnectModal();
		}
	}, [openConnectModal, isConnected]);

	return <ApplicationLayout></ApplicationLayout>;
}

export default Auth;
