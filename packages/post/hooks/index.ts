export const usePostActions = (post_id) => {
  const likePost = () => {};

  const unlikePost = () => {};

  const collectPost = () => {};

  /**
   * @description: Treating creator is sending them a tip
   */
  const treatCreator = () => {};

  const bookmarkPost = () => {};

  return {
    likePost,
    unlikePost,
    collectPost,
    treatCreator,
    bookmarkPost,
  };
};

export const usePostData = (post_id) => {
  const creator: {
    id: string;
    avatar: string;
    address: string;
    username: string;
    display_name: string;
    bio: string;
  } = null;

  const post_metadata: {
    id: string;
    name?: string;
    creator: {
      username: string;
      avatar: string;
      address: string;
    };
    post_type: "collectible" | "subscription";
    text?: string;
    blurhash: string;
    image?: {
      cdn: string;
      ipfs: string;
    };
    subscription?: {
      id: string;
      price: {
        value: number;
        currency: string;
      };
    };
    timestamp: number;
    price?: {
      value: number;
      currency: string;
    };
    collection?: {
      name: string;
      minted: number;
      totalSupply: number;
      avatar: string;
    };
  } = null;

  const collectors: Array<{
    user?: {
      username: string;
      avatar: string;
    };
    address: string;
    tx: string;
    timestamp: number;
  }> = [];

  const likers: Array<{
    user: {
      username: string;
      avatar: string;
    };
    timestamp: number;
  }> = [];

  const treats: Array<{
    user: {
      username: string;
      id: string;
      address: string;
    };
    timestamp: number;
    amount: string;
    currency: string;
    tx: string;
  }> = [];

  const viewers: Array<{
    fingerprint: string;
    timestamp: string;
    session?: string;
  }> = [];

  const tx_history: Array<{
    id: string;
    timestamp: string;
    actor_address: string;
    metadata: string;
    action_type: "mint" | "collect" | "relist";
  }> = [];

  return {
    creator,
    post_metadata,
    collectors,
    likers,
    treats,
    viewers,
    tx_history,
  };
};
