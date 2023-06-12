import {Container} from "@packages/shared/components/Container";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";

const NFTListLoadingSkeleton = () => (
	<Container className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
		{new Array(24).fill(0).map((_, i) => (
			<DynamicSkeleton
				key={i}
				config={TritPostSkeleton}
			/>
		))}
	</Container>
);

export default NFTListLoadingSkeleton;
