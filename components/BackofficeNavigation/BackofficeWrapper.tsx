import Hero from "@components/Hero";
import {Button} from "@packages/shared/components/Button";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useQuery} from "@tanstack/react-query";

import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import {useAccount} from "wagmi";

const AdminDashboardWrapper = ({children}) => {
	const {isConnected} = useAccount();

	const fetcher = async () => {
		const res = await fetch("/api/admin/is-authed");
		const json = await res.json();
		return json;
	};

	const {data, isLoading, isError} = useQuery(["is-authed"], fetcher);

	if (isLoading) {
		return (
			<div
				style={{
					position: "fixed",
					width: "100%",
					height: "100%",
					display: "flex",
					top: 0,
					left: 0,
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Heading
					size={"xss"}
					style={{
						borderRadius: 5,
						padding: 10,
					}}
				>
					Loading...
				</Heading>
			</div>
		);
	}
	if (!isConnected || isError || !data) {
		return (
			<div
				style={{
					position: "fixed",
					width: "100%",
					height: "100%",
					display: "flex",
					top: 0,
					left: 0,
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Heading
					size={"xss"}
					style={{
						borderRadius: 5,
						padding: 10,
					}}
				>
					Please make sure your wallet on the Binance Smart Chain is connected.
				</Heading>
				<Spinner
					animation="border"
					role="status"
					style={{marginTop: 5}}
				>
					<span className="sr-only">Loading...</span>
				</Spinner>
			</div>
		);
	} else {
		if (data.failed)
			return (
				<Hero
					title={"You are not authenticated."}
					subtitle={"You are not permitted to use this dashboard"}
					additionalContent={
						<Link href="/backoffice/login">
							<Button className="bg-primary text-white font-bold">
								<b>{"Login to Panel"}</b>
							</Button>
						</Link>
					}
				/>
			);
		return children;
	}
};

export default AdminDashboardWrapper;
