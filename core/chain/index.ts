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

// TODO: Look at subscriptions

/**
 * 
 * address token: defines the token contract which payments are paid from.
address provider: the address of the provider.
uint256 time_unit: the number of seconds per time unit.
uint256 tokens_per_time_unit: the number of tokens that can be paid towards the subscription per time_unit.
uint256 last_payment_at: the timestamp when the last payment was made.
The triggerPayment method would call token.transfer(provider, (now — last_payment_at) * tokens_per_time_unit / time_unit)`.
Code language: JavaScript (javascript)

 */
