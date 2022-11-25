import { contractAddresses } from "@packages/treat/lib/constants";
import { getContract, getProvider } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ERC20ABI from "../constants/abi/ERC20.json";

const getContractAddress = (contract_name: string) => {
  const contract = contractAddresses[contract_name]["56"];
  return contract;
};

export const getTreatContract = (address: string) => {
  const provider = getProvider({ chainId: 56 });
  const contract = getContract({
    addressOrName: address,
    contractInterface: ERC20ABI.abi,
    signerOrProvider: provider,
  });

  return contract;
};

export const getBalanceByContract = async (
  contract: string,
  address: string
) => {
  const contract_address = getContractAddress(contract);
  const lpContract = getTreatContract(contract_address);
  try {
    const balance: string = await lpContract.methods.balanceOf(address).call();

    return balance;
  } catch (e) {
    console.error({ e });
    return "0";
  }
};

export const useTokenBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const { address } = useAccount();

  const fetchBalance = useCallback(async () => {
    const balance = await getBalanceByContract(tokenAddress, address);
    setBalance(BigNumber.from(balance));
  }, [address, tokenAddress]);

  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address, setBalance, tokenAddress]);

  return balance;
};
