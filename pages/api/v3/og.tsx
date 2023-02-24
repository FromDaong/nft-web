/* eslint-disable react/no-unknown-property */
import {ImageResponse} from "@vercel/og";

export const config = {
	runtime: "experimental-edge",
};

const default_image = (
	<div tw={"w-full h-full flex items-center justify-center"}>
		<img
			src={"og/platform.png"}
			tw={"w-full h-full"}
			style={{
				objectFit: "cover",
			}}
		/>
	</div>
);

const profile_image = (username, display_name, bio, profile_picture) => (
	<div
		tw={
			"w-full h-full flex items-center justify-center bg-[#ffd4da] p-8 text-center relative"
		}
	>
		<img
			src={"og/platform.png"}
			tw={"w-full h-full"}
			style={{
				objectFit: "cover",
			}}
		/>

		<div
			style={{
				position: "absolute",
				width: "518px",
				height: "352px",
				left: "41px",
				top: "230px",
				background: "linear-gradient(90.68deg, #FE7AC5 0.67%, #F67DCB 99.53%)",
				zIndex: 10,
			}}
			tw="flex flex-col w-full items-center w-1/2 h-full absolute top-0 right-0"
		>
			<h1 tw="text-3xl font-bold my-0">{display_name}</h1>
			<p tw="text-lg text-gray-700 max-w-xl">{bio}</p>
			<p tw="text-base text-gray-700 my-8">https://treatnfts.com/{username}</p>
		</div>
		<div
			style={{
				position: "absolute",
				width: "467px",
				height: "467px",
				left: "660px",
				top: "73px",
				borderRadius: "9999px",
				zIndex: 170,
				overflow: "clip",
			}}
		>
			<img
				src={profile_picture}
				tw={"w-full h-full"}
				style={{
					objectFit: "cover",
				}}
			/>
		</div>
	</div>
);

const nft_image = (id, name, description) => (
	<div tw={"w-full h-full flex items-center justify-center"}>
		<img
			src={"og/platform.png"}
			tw={"w-full h-full"}
			style={{
				objectFit: "cover",
			}}
		/>
	</div>
);

const images = {
	profile: profile_image,
	nft: nft_image,
	page: default_image,
};

const font = fetch(
	new URL("../../../assets/helvetica.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function (req) {
	const {searchParams} = new URL(req.url);

	const fontData = await font;

	// ?type=<media_type>
	const hasType = searchParams.has("type");
	const page_type = searchParams.get("type");

	const username = searchParams.get("username");
	const display_name = searchParams.get("display_name");
	const bio = searchParams.get("bio");
	const profile_picture = searchParams.get("profile_picture");

	if (!hasType) {
		return new ImageResponse(default_image, {
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Helvetica",
					data: fontData,
					style: "normal",
				},
			],
		});
	}

	if (page_type === "profile") {
		return new ImageResponse(
			profile_image(username, display_name, bio, profile_picture),
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Helvetica",
						data: fontData,
						style: "normal",
					},
				],
			}
		);
	}

	if (page_type === "nft") {
		const profile_picture_url = profile_picture.substring(
			0,
			profile_picture.length - 1
		);

		return new ImageResponse(
			profile_image(username, display_name, bio, profile_picture_url),
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Helvetica",
						data: fontData,
						style: "normal",
					},
				],
			}
		);
	}

	return new ImageResponse(images[page_type as string], {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Helvetica",
				data: fontData,
				style: "normal",
			},
		],
	});
}
