import { useMoralis } from "react-moralis";
import { Button } from "@chakra-ui/react";

export default function Auth() {
  const { authenticate } = useMoralis();

  const smartConnectWithMoralis = async (wallet) => {
    if (wallet === "walletconnect") {
      authenticate({ provider: "walletconnect", chainId: 56 });
    } else {
      authenticate({ provider: "metamask", chainId: 56 });
    }
  };

  const web3authConnect = () => {
    authenticate({
      provider: "web3Auth",
      chainId: "0x38",
      clientId:
        "BPe6vuRLN_FFW_BWpH6pIKoktC0w7F6epw1vC4SNo-T2WaGXmPhJbZ2viFg29XVwt_U-nRog5dJ4ugiG0Zju35s",
    });
  };

  return (
    <div className="auth-container">
      <Button className=" w-100" onClick={() => smartConnectWithMoralis()}>
        Connect via MetaMask
      </Button>
      <br />
      <Button
        variant="info"
        className="mb-4 w-100"
        onClick={() => smartConnectWithMoralis("walletconnect")}
      >
        Connect via WalletConnect
      </Button>
      <Button variant="warning" className="w-100" onClick={web3authConnect}>
        Connect via Web3Auth
      </Button>
    </div>
  );
}
