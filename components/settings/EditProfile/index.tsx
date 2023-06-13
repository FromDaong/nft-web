import {Modal} from "@packages/modals";
import PersonalInformationForm from "@packages/settings/components/ProfileForms";

export default function EditProfile({isOpen, onClose}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<PersonalInformationForm onClose={onClose} />
		</Modal>
	);
}
