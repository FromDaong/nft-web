import PersonalInformationForm, {
	LinksForm,
} from "@packages/settings/components/ProfileForms";
import {Container} from "@packages/shared/components/Container";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";

export default function Settings() {
	const router = useRouter();
	const query = router.query;

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col w-full max-w-4xl gap-12 p-4 mx-auto mt-16 border shadow-sm rounded-xl"
					css={{
						backgroundColor: "$elementSurface",
						borderColor: "$subtleBorder",
					}}
				>
					<PersonalInformationForm />
					<LinksForm />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
