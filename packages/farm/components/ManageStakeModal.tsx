import {useHarvestFarm, useStaking} from "@packages/farm/utils";
import {Modal} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import * as DropdownMenu from "@radix-ui/react-select";
import {useFormik} from "formik";
import {ChevronDown} from "lucide-react";
import {XIcon} from "lucide-react";
import {useState} from "react";
import {toast} from "react-hot-toast";
import {useAccount, useBalance} from "wagmi";
import * as yup from "yup";

export default function ManageStackModal({isOpen, onClose, pid: id, balance}) {
	const [mode, setMode] = useState("stake");
	const [poolId, setPid] = useState(parseInt(id));

	const {address} = useAccount();
	const {data: treatLpBalance, isLoading: treatLpLoading} = useBalance({
		token: contractAddresses.treatPancakeLP[56],
		addressOrName: address,
	});

	const {data: treatBalance, isLoading: treatLoading} = useBalance({
		token: contractAddresses.treatToken[56],
		addressOrName: address,
	});

	const {stakedAmount, handleStake, handleUnstake, stakedAmountLoading} =
		useStaking(poolId);

	const balances = [treatBalance, treatLpBalance];
	const methods = {
		stake: handleStake,
		unstake: handleUnstake,
	};

	const form = useFormik({
		initialValues: {
			amount: "",
		},
		onSubmit: (values, {setSubmitting}) => {
			const action = `${mode[0].toUpperCase()}${mode.slice(1)}`;
			methods[mode](values.amount.toString())
				.catch((err) => {
					console.log({err});
					toast.error(`${action} failed with reason: ${err.reason}`);
				})
				.finally(() => setSubmitting(false));
		},
		validationSchema: yup.object({
			amount: yup.number().required("Amount is required"),
			//.lessThan(balance + +1, "Cannot exceed balance")
			//.moreThan(0, "Should be more than 0"),
		}),
		validateOnMount: true,
		validateOnBlur: true,
	});

	if (!isOpen) {
		return null;
	}

	console.log({form});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex justify-end w-full p-4">
				<Text>
					<XIcon
						className="w-6 h-6 cursor-pointer"
						onClick={onClose}
					/>
				</Text>
			</Container>

			<>
				<Container className="flex flex-col w-full">
					<Container className="p-4 w-full flex justify-between items-center">
						<SelectFarm
							pid={poolId}
							setPid={setPid}
						/>
						<ModeToggle
							mode={mode}
							setMode={setMode}
						/>
					</Container>
					{(treatLoading || stakedAmountLoading || treatLpLoading) && (
						<Container className="flex flex-col items-center justify-center w-full py-8">
							<Spinner />
						</Container>
					)}
					{!treatLoading && !stakedAmountLoading && !treatLpLoading && (
						<>
							<Container className="p-4">
								<HarvestMelonRewards
									id={poolId}
									balance={balances[poolId]?.formatted}
									stakeBalance={stakedAmount.toNumber()}
								/>
							</Container>
							<Container className={"grid grid-cols-1 gap-2"}>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										form.handleSubmit(e);
									}}
									className="p-4 flex flex-col relative gap-8"
								>
									<SwapInput
										value={form.values.amount}
										onChange={(e) =>
											form.setFieldValue("amount", e.target.value)
										}
										currency={`${["TREAT", "TREAT/BNB"][poolId]}`}
										name={"amount"}
										balance={balances[poolId]?.formatted}
									/>
									<Container className="flex justify-end gap-4">
										<Button
											onClick={onClose}
											appearance={"subtle"}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											css={{
												backgroundColor:
													mode === "unstake" ? "$red11" : "$accentText",
												opacity: form.isSubmitting || !form.isValid ? 0.5 : 1,
											}}
											className="capitalize"
											disabled={form.isSubmitting || !form.isValid}
										>
											{form.isSubmitting ? (
												<>
													<Spinner />
													Please wait...
												</>
											) : (
												<>{mode}</>
											)}
										</Button>
									</Container>
								</form>
							</Container>
						</>
					)}
				</Container>
			</>
		</Modal>
	);
}

const SwapInput = ({value, onChange, currency, ...restProps}) => {
	return (
		<Container className="flex flex-col gap-2 mb-4">
			<Container className="flex flex-col relative">
				<Input
					value={value}
					onChange={onChange}
					{...restProps}
					placeholder={"0.0"}
				/>
			</Container>
			{restProps.balance || restProps.balance === 0 ? (
				<Container className="flex justify-between items-center">
					<Text>
						<SmallText>
							<ImportantText>Balance: {restProps.balance}</ImportantText>
						</SmallText>
					</Text>
					{restProps.balance || restProps.balance === 0 ? (
						<Button
							type="button"
							appearance={"surface"}
							size={"sm"}
							onClick={() =>
								onChange({
									target: {
										value: restProps.balance,
									},
								})
							}
						>
							Max
						</Button>
					) : null}
				</Container>
			) : null}
		</Container>
	);
};

function HarvestMelonRewards({balance, id, stakeBalance}) {
	const {harvestFarm} = useHarvestFarm(id);
	return (
		<Container
			css={{
				backgroundColor: "$accentBg",
				borderColor: "$border",
			}}
			className="flex flex-col gap-4 p-4 shadow-sm rounded-xl"
		>
			<Heading
				size={"xss"}
				css={{
					color: "$accentText",
				}}
			>
				My positions
			</Heading>
			<Container>
				<Container className={"w-full justify-between gap-4 flex"}>
					<Text>
						<ImportantText>Staked {["TREAT", "TREAT/BNB"][id]}</ImportantText>
					</Text>
					{(balance || balance === 0) && (
						<>
							<Text
								css={{
									color: "$accentText",
								}}
							>
								<ImportantText>
									{Intl.NumberFormat().format(parseInt(stakeBalance))}
								</ImportantText>{" "}
							</Text>
						</>
					)}
					{!balance && balance !== 0 && (
						<>
							<Container
								className="w-32 p-4 rounded-xl"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							/>
							<Container
								className="w-16 p-4 rounded-xl"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							/>
						</>
					)}
				</Container>
				<Container className={"w-full justify-between mt-2 gap-4 flex"}>
					<Text>
						<ImportantText>Balance</ImportantText>
					</Text>
					{(balance || balance === 0) && (
						<>
							<Text
								css={{
									color: "$accentText",
								}}
							>
								<ImportantText>
									{Intl.NumberFormat().format(parseInt(balance))}
								</ImportantText>{" "}
							</Text>
						</>
					)}
					{!balance && balance !== 0 && (
						<>
							<Container
								className="w-32 p-4 rounded-xl"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							/>
							<Container
								className="w-16 p-4 rounded-xl"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							/>
						</>
					)}
				</Container>
			</Container>
		</Container>
	);
}

const ModeToggle = ({mode, setMode}) => {
	const ModeButton = ({thisMode}) => (
		<Container
			className={`flex items-center justify-center rounded-lg transition-colors duration-200 px-4 cursor-pointer py-2 `}
			css={{
				backgroundColor:
					mode === thisMode ? "$surfaceOnSurface" : "$elementOnSurface",
			}}
			onClick={() => setMode(thisMode)}
		>
			<Text className="capitalize">
				<ImportantText>{thisMode}</ImportantText>
			</Text>
		</Container>
	);

	return (
		<Container
			className="flex gap-2 p-1 rounded-lg"
			css={{
				backgroundColor: "$elementOnSurface",
			}}
		>
			<ModeButton thisMode={"stake"} />
			<ModeButton thisMode={"unstake"} />
		</Container>
	);
};

function SelectFarm({pid, setPid}) {
	return (
		<DropdownMenu.Root onValueChange={(value) => setPid(parseInt(value))}>
			<DropdownMenu.Trigger
				type="button"
				className="flex gap-2"
			>
				<Text
					css={{
						color: "$textContrast",
					}}
				>
					<ImportantText>
						{["TREAT Farm", "Treat Liquidity Pool"][pid]}
					</ImportantText>
				</Text>
				<DropdownMenu.Icon>
					<Text>
						<ChevronDown className="w-5 h-5" />
					</Text>
				</DropdownMenu.Icon>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="bg-white p-2 rounded-xl shadow-2xl">
				<DropdownMenu.Viewport>
					<DropdownMenu.Item
						value={"0"}
						className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100"
					>
						<Text>
							<ImportantText>TREAT Farm</ImportantText>
						</Text>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						value={"1"}
						className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100"
					>
						<Text>
							<ImportantText>TREAT Liquidity Pool</ImportantText>
						</Text>
					</DropdownMenu.Item>
				</DropdownMenu.Viewport>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
