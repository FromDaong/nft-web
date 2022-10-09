export default class TreatCore {
  web3: TreatWeb3Engine;
}

export interface TreatWeb3Engine {
  chain_id: number;
}

export interface TreatAPIEngine {
  api_version: string;
}

export interface TreatConfig {
  prefix: string;
  chains: Array<{
    label: string;
    chain_id: string;
    name: string;
  }>;
}

export type TreatUser = {
  address: string;
  connected_addresses: () => Promise<Array<string>>;
  username: string;
  email_address: string;
  fingerprint: string;
  connected_chains: string;
  display_name: string;
  bio: string;
  date_registered: number;
  disabled: string;
  banned: string;
  referral_code: string;
  profile_picture: string;
  banner_picture: string;
  social_accounts: Array<{ name: string; url: string }>;
  streaming_details: {
    stream_id: string;
    stream_key: string;
    playback_id: string;
  };
};

export interface TreatAuthEngine {
  currentUser: TreatUser;

  signInWithWallet();
  signInWithSocial();

  signOut();
}
