export type TimelinePost = {
  id: string;
  author: {
    username: string;
    avatar: string;
    display_name: string;
    bio: string;
    close_followers: Array<{
      username: string;
      avatar: string;
    }>;
  };
  text?: string;
  post_type: "subscription" | "nft";
  timestamp: number;
  blurhash?: string;
  post_detail?: SubscriptionNFT | TritNFT;
};

export type SubscriptionNFT = {
  media: {
    cdn: string;
    ipfs: string;
  };
  subscription: {
    price: {
      value: number;
      currency: string;
    };
    author: {
      username: string;
      avatar: string;
      display_name: string;
    };
  };
};

export type TritNFT = {
  collection: {
    id: string;
    name: string;
    total: number;
    minted: number;
  };
  price: {
    value: number;
    currency: "BNB" | "TREAT";
  };
  media: {
    cdn: string;
    ipfs: string;
  };
};

export type Like = {
  id: string;
  actor: string;
  post_id: string;
  timestamp: number;
};
