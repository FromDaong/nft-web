import {Button} from "@packages/shared/components/Button";
import {ConnectButton} from "@rainbow-me/rainbowkit";

export default function ThemedConnectButton() {
	return (
		<ConnectButton.Custom>
			{({account, chain, openChainModal, openConnectModal, mounted}) => {
				return (
					<div
						{...(!mounted && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!mounted || !account || !chain) {
								return (
									<Button
										onClick={openConnectModal}
										type="button"
									>
										Connect Wallet
									</Button>
								);
							}

							if (chain.unsupported) {
								return <Button onClick={openChainModal}>Wrong network</Button>;
							}
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
