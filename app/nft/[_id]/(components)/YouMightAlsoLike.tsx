import {Container} from "@packages/shared/components/Container";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

const YouMightAlsoLike = () => {
	const {
		isLoading: youMightAlsoLikeLoading,
		error: youMightAlsoLikeError,
		data: youMightAlsoLikeData,
	} = TreatCore.useQuery({
		queryKey: ["youMightAlsoLikeNFTs"],
		queryFn: getYouMightAlsoLike,
	});

	const trendingNFTs =
		youMightAlsoLikeError || youMightAlsoLikeLoading
			? []
			: youMightAlsoLikeData?.map((post) => legacy_nft_to_new(post));

	return (
		<Container className="flex flex-col gap-12 px-8">
			<Container className="flex flex-col gap-4">
				<Heading size="sm">You might also like</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{!youMightAlsoLikeError && !youMightAlsoLikeLoading
					? trendingNFTs.slice(0, 4).map((item) => (
							<TritPost
								key={item.id}
								inGrid
								{...item}
							/>
					  ))
					: [0, 1, 2, 3].map((i) => (
							<DynamicSkeleton
								key={"skeleton" + i}
								config={TritPostSkeleton}
							/>
					  ))}
			</Container>
		</Container>
	);
};

export default YouMightAlsoLike;
