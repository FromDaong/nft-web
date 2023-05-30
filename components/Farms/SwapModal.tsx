import {useHarvestFarm, useStaking} from "@packages/farm/utils";
import {Modal, ModalHeaderSection} from "@packages/modals";
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
import {useFormik} from "formik";
import * as yup from "yup";

export default function SwapModal({
	isOpen,
	onClose,
	title,
	currency,
	pid,
	balance,
}) {
	const {handleStake, handleUnstake, stakedAmount} = useStaking(pid);
	const stakeBalance = stakedAmount?.toNumber() || 0;

	const stakeForm = useFormik({
		initialValues: {
			amount: "",
		},
		onSubmit: (values, {setSubmitting}) => {
			handleStake(values.amount.toString()).then(() => setSubmitting(false));
		},
		validationSchema: yup.object({
			amount: yup
				.number()
				.required("Amount is required")
				.lessThan(balance, "Cannot exceed balance")
				.moreThan(0, "Should be more than 0"),
		}),
	});

	const unstakeForm = useFormik({
		initialValues: {
			amount: "",
		},
		onSubmit: (values, {setSubmitting}) => {
			handleUnstake(values.amount.toString()).then(() => setSubmitting(false));
		},
		validationSchema: yup.object({
			amount: yup
				.number()
				.required("Amount is required")
				.lessThan(balance, "Cannot exceed balance")
				.moreThan(0, "Should be more than 0"),
		}),
	});

	console.log({balance});

	if (!isOpen) {
		return null;
	}
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalHeaderSection
				title={title}
				onClose={onClose}
			/>
			<Container className="flex flex-col w-full">
				<Container className="p-4 w-full">
					<Text>
						Stake $Treat to earn $Melon. Exchange $Melon at the Farmers' Market
						to get exclusive NFTs.
					</Text>
				</Container>
				<Container className="p-4">
					<HarvestMelonRewards
						id={pid}
						balance={balance}
					/>
				</Container>
				<Container className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							stakeForm.handleSubmit(e);
						}}
						className="p-4 flex flex-col relative gap-8"
					>
						<Container
							css={{backgroundColor: "$elementOnSurface"}}
							className="p-4 flex flex-col gap-2 rounded-xl"
						>
							<SwapInput
								value={stakeForm.values.amount}
								onChange={(e) =>
									stakeForm.setFieldValue("amount", e.target.value)
								}
								currency={`${currency}`}
								name={"amount"}
								balance={0}
							/>
							<Button
								disabled={!stakeForm.isValid || stakeForm.isSubmitting}
								type={"submit"}
								appearance={!stakeForm.isValid ? "disabled" : "default"}
							>
								{stakeForm.isSubmitting ? <Spinner /> : "Stake"}
							</Button>
						</Container>
					</form>
					<form
						className="p-4"
						onSubmit={(e) => {
							e.preventDefault();
							unstakeForm.handleSubmit(e);
						}}
					>
						<Container
							css={{backgroundColor: "$elementOnSurface"}}
							className="p-4 flex flex-col gap-2 rounded-xl"
						>
							<SwapInput
								value={unstakeForm.values.amount}
								onChange={(e) =>
									unstakeForm.setFieldValue("amount", e.target.value)
								}
								currency={`Staked ${currency}`}
								name={"staked"}
								balance={stakeBalance}
							/>
							<Button
								disabled={!unstakeForm.isValid || unstakeForm.isSubmitting}
								type={"submit"}
								appearance={!unstakeForm.isValid ? "disabled" : "default"}
							>
								{" "}
								{unstakeForm.isSubmitting ? <Spinner /> : "Unstake"}
							</Button>
						</Container>
					</form>
				</Container>
			</Container>
		</Modal>
	);
}

const SwapInput = ({value, onChange, currency, ...restProps}) => {
	return (
		<Container className="flex flex-col gap-2 mb-4">
			<Container className="gap-2">
				<Text>
					<ImportantText>{currency}</ImportantText>
				</Text>
			</Container>
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
							appearance={"subtle"}
							size={"sm"}
							onClick={() => onChange(restProps.balance)}
						>
							Max
						</Button>
					) : null}
				</Container>
			) : null}
		</Container>
	);
};

function HarvestMelonRewards({balance, id}) {
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
				Rewards
			</Heading>
			<Container className={"w-full justify-between gap-4 flex"}>
				{(balance || balance === 0) && (
					<>
						<Text
							css={{
								color: "$accentText",
							}}
						>
							<ImportantText>
								${Intl.NumberFormat().format(parseInt(balance))}
							</ImportantText>{" "}
							MELON
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
			<Button
				className="w-fit disabled:cursor-not-allowed"
				disabled={parseInt(balance) === 0}
				appearance={parseInt(balance) === 0 ? "disabled" : "accent"}
				onClick={harvestFarm}
			>
				Harvest rewards
			</Button>
		</Container>
	);
}
