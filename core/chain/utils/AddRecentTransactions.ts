import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

//TODO: Implement a component that adds transactions to user history

export default useAddRecentTransaction;

/*
export default () => {
  const addRecentTransaction = useAddRecentTransaction();

  return (
    <button
      onClick={() => {
        addRecentTransaction({
          hash: "0x...",
          description: "...",
        });
      }}
    >
      Add recent transaction
    </button>
  );
};
*/
