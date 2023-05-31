import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import BigNumber from "bignumber.js";
import {ethers} from "ethers";
import {useCallback, useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useAccount, useContract, useSigner, useWaitForTransaction} from "wagmi";
import Web3 from "web3";

export const useFarmContracts = () => {
	const {data} = useSigner();

	const treatLpContract = useContract({
		addressOrName: contractAddresses.treatPancakeLP[56],
		contractInterface: ABI.pancakeLP,
		signerOrProvider: data,
	});
	const masterMelonContract = useContract({
		addressOrName: contractAddresses.masterMelonFarmer[56],
		contractInterface: ABI.masterMelonFarmer,
		signerOrProvider: data,
	});
	const treatContract = useContract({
		addressOrName: contractAddresses.treatToken[56],
		contractInterface: ABI.treat,
		signerOrProvider: data,
	});

	return {
		treatLp: treatLpContract,
		masterMelon: masterMelonContract,
		treatToken: treatContract,
	};
};

export const useHasApprovedFarm = (pid: number) => {
	const {address} = useAccount();

	const [hasApprovedState, setHasApprovedState] = useState(false);
	// const treatV1ForV2Contract = getTreatV1ForV2Contract(treat);

	const {treatLp, treatToken} = useFarmContracts();

	const handleApprove = useCallback(async () => {
		try {
			let tx;
			if (pid === 0) {
				tx = await treatToken
					.approve(
						contractAddresses.masterMelonFarmer[56],
						ethers.constants.MaxUint256
					)
					.send({from: address});
			} else {
				tx = await treatLp
					.approve(
						contractAddresses.masterMelonFarmer[56],
						ethers.constants.MaxUint256
					)
					.send({from: address});

				return tx;
			}
		} catch (e) {
			console.error("errhandleApprove ", e);
			return false;
		}
	}, []);

	const useHasApprovedContract = useCallback(async () => {
		let hasApproved;
		if (pid === 0) {
			hasApproved = await treatToken.allowance(
				address,
				contractAddresses.masterMelonFarmer[56]
			);
		} else {
			hasApproved = await treatLp.allowance(
				address,
				contractAddresses.masterMelonFarmer[56]
			);
		}
		setHasApprovedState(hasApproved);
	}, [address, treatLp, treatToken]);

	useEffect(() => {
		if (treatToken) {
			useHasApprovedContract();
		}
	}, [address, treatToken]);

	return {hasApproved: hasApprovedState, approve: handleApprove};
};

export const useHarvestFarm = (pid: number) => {
	const {masterMelon} = useFarmContracts();
	const {address} = useAccount();
	const [pendingMelons, setPendingMelons] = useState(null);
	const [pendingMelonsLoading, setPendingMelonsLoading] = useState(false);
	// usewaitfortransaction for the harvestFarm tx

	const fetchPendingMelons = useCallback(async () => {
		setPendingMelonsLoading(true);
		const amount = await masterMelon.pendingMelon(pid, address);
		if (amount) setPendingMelons(amount);

		setPendingMelonsLoading(false);
	}, [address, masterMelon, pid]);

	const harvestFarm = useCallback(async () => {
		if (masterMelon) {
			let tx;
			if (pid === 0) {
				tx = await masterMelon
					.leaveStaking("0", {
						from: address,
					})
					.catch((e) => {
						throw "Error harvesting melons";
					});

				return tx;
			}

			tx = await masterMelon
				.deposit(pid, "0", {
					from: address,
				})
				.catch((e) => {
					throw "Error harvesting melons";
				});

			return tx;
		}
	}, [masterMelon]);

	useEffect(() => {
		if (address && masterMelon && !pendingMelons) {
			fetchPendingMelons();
		}
	}, [pid, address, masterMelon, pendingMelons]);

	return {
		harvestFarm,
		pendingMelons,
		pendingMelonsLoading,
		fetchPendingMelons,
	};
};

export const useStaking = (pid: number) => {
	const [stakedAmount, setStakedAmount] = useState(new BigNumber(0));
	const [stakedAmountLoading, setStakedAmountLoading] = useState(false);

	const {address} = useAccount();
	const {masterMelon} = useFarmContracts();

	const handleStake = useCallback(
		async (amount: string) => {
			const value = Web3.utils.toWei(amount.toString());
			if (pid === 0) {
				const tx = await masterMelon.enterStaking(value, {
					from: address,
				});

				return tx;
			}

			const tx = await masterMelon.deposit(pid, value, {
				from: address,
			});
			return tx;
		},
		[address, masterMelon, pid]
	);

	const handleUnstake = useCallback(
		async (amount: string) => {
			const value = Web3.utils.toWei(amount.toString());
			if (pid === 0) {
				const tx = await masterMelon.leaveStaking(value, {
					from: address,
				});

				return tx;
			}

			const tx = await masterMelon.withdraw(pid, value, {
				from: address,
			});

			return tx;
		},
		[address, masterMelon, pid]
	);

	const fetchStakedAmount = useCallback(async () => {
		setStakedAmountLoading(true);
		try {
			const {amount} = await masterMelon.userInfo(pid, address);
			setStakedAmount(amount as BigNumber);
		} catch (e) {
			console.error(e);
		} finally {
			setStakedAmountLoading(false);
		}
	}, [address, masterMelon, pid]);

	useEffect(() => {
		fetchStakedAmount();
	}, [pid]);

	return {
		handleStake,
		handleUnstake,
		stakedAmount,
		stakedAmountLoading,
		fetchStakedAmount,
	};
};