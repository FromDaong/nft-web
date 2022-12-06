import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";

export default function NFT() {
	const router = useRouter();
	const {id} = router.query;

	return (
		<>
			<ApplicationLayout>
				<ApplicationFrame></ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}
