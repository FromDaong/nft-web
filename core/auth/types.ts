export interface AuthAdapter {
  user?: object;
  wallet?: object;
  metadata: object;
  getCurrentUser: () => Promise<void>;
  updateCurrentUserBaseInfo: (update: object) => Promise<boolean>;
  updateCurrentUserWallet: (
    new_wallet: {
      address: string;
      signature: string;
    },
    signature: string
  ) => Promise<boolean>;
  deleteCurrentUser: (signature: string) => Promise<boolean>;
  updateCurrentUserMetadata: (update: object) => Promise<boolean>;
  disableCurrentUser: (signature: string) => Promise<boolean>;
  requestUpgradeCurrentUserToCreator: () => Promise<boolean>;
  downgradeCurrentUserFromCreator: () => Promise<boolean>;

  loginWithWallet: () => void;
  loginWithSocial: () => void;

  signMessageWithCurrentUser: (message: string) => string;

  signOut: () => Promise<boolean>;
}
