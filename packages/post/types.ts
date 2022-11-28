export type Post = {
  id: string;
  name?: string;
  text?: string;
  blurhash: string;
  image?: {
    cdn: string;
    ipfs: string;
  };
  author: {
    display_name: string;
    username: string;
    avatar: string;
    bio?: string;
  };
  subscription?: {
    id: string;
    price: {
      value: number;
      currency: string;
    };
  };
  likes?: Array<{
    user: {
      username: string;
      avatar: string;
    };
    timestamp: number;
  }>;
  collected?: Array<{
    user?: {
      username: string;
      avatar: string;
    };
    address: string;
    tx: string;
    timestamp: number;
  }>;
  timestamp: number;
  post_type: "colletible" | "subscription";
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
  inGrid?: boolean;
};

export type LivestreamPost = {
  id: string;
  name?: string;
  text?: string;
  blurhash: string;
  image?: {
    cdn: string;
    ipfs: string;
  };
  author: {
    display_name: string;
    username: string;
    avatar: string;
  };
  subscription?: {
    id: string;
    price: {
      value: number;
      currency: string;
    };
  };
  likes?: Array<{
    user: {
      username: string;
      avatar: string;
    };
    timestamp: number;
  }>;
  timestamp: number;
};