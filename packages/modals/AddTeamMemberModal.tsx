import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {useDebounce} from "@packages/shared/hooks";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {Modal} from ".";

const getProfiles = async (search: string) => {
	const response = await axios.get(
		`${apiEndpoint}/profile/autocomplete?q=${search}`
	);
	const data = await response.data;
	return data.data;
};

export default function AddTeamMemberModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => any;
}) {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const searchValue = useDebounce(search, 500);
	const [isFocused, setIsFocused] = useState(false);
	const [badge, setBadge] = useState("team");
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	// fetch users with useQuery
	const {isFetching, data, refetch} = TreatCore.useQuery({
		queryKey: [`users:addTeam:${searchValue}`],
		queryFn: () => getProfiles(searchValue),
	});

	useEffect(() => {
		if (data) {
			setUsers(data);
		} else {
			setUsers([]);
		}
	}, [data]);

	useEffect(() => {
		if (!searchValue) return;
		refetch();
	}, [searchValue]);

	const setFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const removeFocus = useCallback(() => {
		setIsFocused(false);
	}, []);

	const addBadgesToUser = async () => {
		setLoading(true);
		axios
			.post(`${apiEndpoint}/profile/${selectedUser.username}/badges`, {badge})
			.then(() => router.reload())
			.catch((err) => setLoading(false));
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col w-full gap-8 min-w-[380px]">
				<Heading size="xs">Add a new team member</Heading>
				<Container className="flex flex-col group">
					<Input
						name="search"
						autoComplete="off"
						placeholder="Search for a user"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onFocus={setFocus}
					/>
					{isFocused && (
						<Container className="relative w-full hidden group-focus-within:flex">
							<Container
								css={{
									backgroundColor: "$surface",
									borderColor: "$border",
									maxHeight: "200px",
									overflowY: "auto",
								}}
								className="flex absolute top-0 left-0 w-full flex-col shadow-xl rounded-xl border transition-all duration-300"
							>
								{users.map((user) => (
									<button
										key={user._id}
										className="flex flex-col w-full px-4 py-2"
										onClick={() => {
											removeFocus();
											setSelectedUser(user);
										}}
									>
										<Container className="flex gap-2">
											<Text>
												<ImportantText>{user.username}</ImportantText>
											</Text>
											<Text>
												<SmallText>{user.display_name}</SmallText>
											</Text>
										</Container>
										<Text>
											<SmallText>{user.address}</SmallText>
										</Text>
									</button>
								))}
								{isFetching && (
									<Container className="flex justify-center py-4">
										<Spinner />
									</Container>
								)}
								{!isFetching && !users.length && (
									<Container className="flex justify-center py-4">
										<Text>No profiles found for that query</Text>
									</Container>
								)}
							</Container>
						</Container>
					)}
				</Container>
				{selectedUser && (
					<Container className="flex flex-col gap-y-4 transition-opacity duration-300">
						<Container className="flex flex-col">
							<Text>Username</Text>
							<Text>
								<ImportantText>{selectedUser.username}</ImportantText>
							</Text>
						</Container>
						{selectedUser.display_name && (
							<Container className="flex flex-col">
								<Text>Display name</Text>
								<Text>
									<ImportantText>{selectedUser.display_name}</ImportantText>
								</Text>
							</Container>
						)}
						<Container className="flex flex-col">
							<Text>Wallet</Text>
							<Text>
								<ImportantText>{selectedUser.address}</ImportantText>
							</Text>
						</Container>
						<Container className="flex flex-col">
							<Text>
								<ImportantText>Role</ImportantText>
							</Text>
							<div className="flex mt-2 space-x-4">
								<div className="flex items-center">
									<input
										id="team"
										name="badge"
										checked={badge === "team"}
										type="radio"
										className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
									<label
										htmlFor="team"
										className="ml-3 block text-sm font-medium text-gray-700"
									>
										<Text>Team</Text>
									</label>
								</div>
								<div className="flex items-center">
									<input
										id="council"
										checked={badge === "council"}
										onChange={(e) => {
											setBadge(e.target.value);
										}}
										name="badge"
										type="radio"
										className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
									<label
										htmlFor="council"
										className="ml-3 block text-sm font-medium text-gray-700"
									>
										<Text>Council</Text>
									</label>
								</div>
							</div>
						</Container>
					</Container>
				)}
				<Container className="flex justify-end gap-4 w-full">
					<Button
						appearance={"surface"}
						onClick={onClose}
					>
						Cancel
					</Button>

					<Button
						disabled={!selectedUser || loading}
						appearance={selectedUser && !loading ? "action" : "disabled"}
						onClick={addBadgesToUser}
						className="flex items-center justify-center gap-2"
					>
						{!loading ? "Add" : <Spinner />}
					</Button>
				</Container>
			</Container>
		</Modal>
	);
}
