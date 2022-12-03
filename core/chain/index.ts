import {chains_map} from "./constants";

export const getChainNameById = (id: number): string => {
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
