import {Container} from "@packages/shared/components/Container";

export default function SettingsBanner() {
	return (
		<Container>
			<div
				style={{
					backgroundImage: "url('/assets/backgrounds/settings-bg.png')",
					backgroundSize: "cover",
					height: 200,
				}}
			></div>
		</Container>
	);
}
