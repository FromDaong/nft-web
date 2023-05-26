import ProfileLayout from "core/components/layouts/ProfileLayout";
import {useSession} from "next-auth/react";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const {data: session} = useSession();
	const data = JSON.parse(props.data);
	const {username} = data;
	const {profile} = (session as any) ?? {profile: {}};

	return <ProfileLayout userProfile={data}></ProfileLayout>;
}

export const getServerSideProps = beforePageLoadGetUserProfile;
