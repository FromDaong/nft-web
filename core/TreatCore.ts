import { ReactNode, useEffect, useRef } from "react";
import { PrismaClient } from "@prisma/client";

export type Context = { prisma: PrismaClient; currentUserEmail: string };

export default class TreatCore {
  web3: TreatWeb3Engine;
  services = {
    timeline: process.env.TIMELINE_SERVICE,
    user: process.env.USER_SERVICE,
    feed: process.env.FEED_SERVICE,
    trit: process.env.TREAT_SERVICE,
  };

  /**
   * @description Trigger analytics event & logger then sync.
   * @param event_type
   * @param metadata
   */
  async triggerEvent(event_type: string, metadata: object) {
    // TODO: Implement logger
    // TODO: Sync to server

    const meta = JSON.stringify(metadata);
    const event = {
      id: "",
      event_type,
      metadata: meta,
    };

    const log_event = { id: "", created_at: Date.now(), metadata: meta };
    console.log({ event_type, metadata: JSON.stringify(metadata) });
  }

  static getFormattedNumber = (value: number): string => {
    return Intl.NumberFormat().format(value);
  };
}

export type ComponentBasicProps = {
  children: ReactNode;
};

export type AnalyticsEvent = {
  id: string;
  event_type: string;
  metadata: string;
};

export type LogEvent = {
  id: string;
  created_at: number;
  metadata: string;
};

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

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
