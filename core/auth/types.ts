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

export interface TreatUser {
  userId: string
  profile: object
  sendEmail()
  updateProfile()
  signOut()
  checkPermissions()
  buyNFT()
}

interface TreatCreatorTools {
  mintNFT()
  verifyCreatorProfile()
}

export class TreatCreator implements TreatUser, TreatCreatorTools {


  profile: object;
  userId: string;

  mintNFT() {
    return
  }

  buyNFT() {
    return
  }

  checkPermissions() {
    return
  }

  sendEmail() {
    return
  }

  signOut() {
    return
  }

  updateProfile() {
    return
  }

  verifyCreatorProfile() {
    return
  }
}