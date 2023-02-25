import PersonalInformationForm, {
	LinksForm,
} from "@packages/settings/components/ProfileForms";
import {Container} from "@packages/shared/components/Container";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Settings() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col w-full max-w-4xl gap-12 p-4 mx-auto mt-16 border shadow rounded-xl"
					css={{
						borderColor: "$border",
					}}
				>
					<PersonalInformationForm />
					{false && <LinksForm />}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
