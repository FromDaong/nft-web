export {};

export const getChainNameById = (id: number): string => {
  const chains_map = [
    {
      id: 1,
      name: "Ethereum",
    },
    {
      id: 3,
      name: "Ropsten",
    },
    {
      id: 4,
      name: "Rinkeby",
    },
    {
      id: 5,
      name: "Goerli",
    },
    {
      id: 42,
      name: "Kovan",
    },
    {
      id: 11155111,
      name: "Sepolia",
    },
    {
      id: 10,
      name: "Optimism",
    },
    {
      id: 420,
      name: "Optimism Goerli",
    },
    {
      id: 69,
      name: "Optimism Kovan",
    },
    {
      id: 137,
      name: "Polygon",
    },
    {
      id: 80001,
      name: "Polygon Mumbai",
    },
    {
      id: 42161,
      name: "Arbitrum One",
    },
    {
      id: 421613,
      name: "Arbitrum Goerli",
    },
    {
      id: 421611,
      name: "Arbitrum Rinkeby",
    },
    {
      id: 1337,
      name: "Localhost",
    },
    {
      id: 31337,
      name: "Hardhat",
    },
    {
      id: 31337,
      name: "Foundry",
    },
  ];

  return chains_map.find((chain) => chain.id === id)?.name || "Unknown network";
};
