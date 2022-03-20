import { Button } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";

export default function Auth() {
  const { authenticate, isAuthenticating } = useMoralis();

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
        "BMUF4XcCUy62JfBjwO5Rb1DcYlhEIDf66aifsTtJPTQCat2tlFC3_eijeO9q-AcHGL-HsiMf4qxRjzkXmOC_dEs",
    });
  };

  return (
    <div className="auth-container">
      <Button
        isLoading={isAuthenticating}
        className="bg-primary text-white font-bold"
        onClick={() => smartConnectWithMoralis()}
      >
        Connect via MetaMask
      </Button>
      <br />
      <Button
        colorScheme="purple"
        isLoading={isAuthenticating}
        className="font-bold"
        onClick={() => smartConnectWithMoralis("walletconnect")}
      >
        Connect via WalletConnect
      </Button>
      <Button
        isLoading={isAuthenticating}
        colorScheme="yellow"
        className="font-bold"
        onClick={web3authConnect}
      >
        Connect via Web3Auth
      </Button>
    </div>
  );
}
