import {
  ChatMessage,
  ChatParticipant,
  Notification,
  NotificationType,
} from "../../components/Live/types";
import { createContext, useContext, useEffect, useState } from "react";
import useERC20, {
  ContractInteractionTypes,
  TippingCurrencies,
} from "@hooks/useERC20";

import Axios from "axios";
import { Context } from "../TreatProvider";
import Web3 from "web3";
import { contractAddresses } from "@treat/lib/constants";
import { make_id } from "../../components/Live/utils";
import { reactPusher } from "../../lib/pusher";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";
import { useToast } from "@chakra-ui/react";

export const LiveStreamChatContext = createContext<{
  currently_playing: string | null;
  messages: Array<Notification>;
  last_message: Notification | null;
  participants: Array<ChatParticipant>;
  host: string | null;
  isHost: boolean;
  latestReactionMessage: Notification | null;
  setHost: () => void;
  setCurrentlyPlaying: (string) => void;
  sendMessage: (message: string) => void;
  sendTip: (
    currency_address: string,
    creator_address: string,
    amount: number,
    currency: string
  ) => Promise<any>;
  sendReaction: (text: string) => void;
  retryMessage: (payload: Notification) => void;
  clearLatestReactionMessage: () => void;
  isBanned: boolean;
  banAddress: (address: string) => void;
  liftBan: (address: string) => void;
  kickout: (address: string) => void;
}>({
  currently_playing: null,
  messages: [],
  last_message: null,
  participants: [],
  host: null,
  isHost: false,
  latestReactionMessage: null,
  sendMessage: (message) => ({ message }),
  sendTip: async (a, b, c, d) => ({ a, b, c, d }),
  sendReaction: (text) => ({ text }),
  setHost: () => null,
  setCurrentlyPlaying: (a) => ({ a }),
  retryMessage: (m) => ({ m }),
  clearLatestReactionMessage: () => ({}),
  isBanned: false,
  banAddress: (a) => ({ a }),
  liftBan: (a) => ({ a }),
  kickout: (a) => ({ a }),
});

export const LiveStreamChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState<Array<Notification>>([]);
  const [currently_playing, setCurrently_playing] = useState<string | null>(
    null
  );
  const [needsRetry, setNeedsRetry] = useState<Array<Notification>>([]);
  const [last_message, setLastMessage] = useState<Notification | null>(null);
  const [participants, setParticipants] = useState<Array<ChatParticipant>>([]);
  const [presenceChannel, setPresenceChannel] = useState(null);
  const [presenceInfo, setPresenceInfo] = useState<{
    id: string;
    info: object;
  }>(null);
  const [isHost, setIs_host] = useState(false);
  const [host, setHost] = useState<string | null>(null);
  const [, setIsThrottled] = useState(false);
  const [latestReactionMessage, setLatestReactionMessage] = useState(null);
  const [banned, setBanned] = useState([]);
  const [isBanned, setIsBanned] = useState(false);

  const { account } = useMoralis();
  const { treat } = useContext(Context);
  const toast = useToast();
  const { approval, allowance, balanceOf } = useERC20();
  const [hasTipApproval, setTipApproval] = useState<boolean>(false);
  const router = useRouter();

  const setIsPlaying = (playback_id) => {
    setCurrently_playing(playback_id);
  };

  const setIsHost = () => {
    setIs_host(true);
  };

  const addMeToParticipants = () => {
    const presenceChannel = reactPusher.subscribe(
      `presence-${currently_playing}`
    );
    setPresenceChannel(presenceChannel);
    presenceChannel.bind("pusher:subscription_succeeded", function () {
      // @ts-ignore
      const me = presenceChannel.members.me;

      const userId = me.id;
      const userInfo = me.info;
      setPresenceInfo({ id: userId, info: userInfo });
      // Set unique items only in partipants
      setParticipants((prevParticipants) =>
        Array.from(
          new Set([
            ...prevParticipants,
            {
              user_id: userId,
              address: userInfo.address,
              username: userInfo.username,
              avatar: userInfo.avatar,
            },
          ])
        )
      );
    });
  };

  const removeMeFromParticipants = () => {
    reactPusher.unsubscribe(`presence-${currently_playing}`);
    setPresenceChannel(null);
    setPresenceInfo(null);
    if (presenceInfo) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.user_id !== presenceInfo?.id)
      );
    }
  };

  const getParticipants = () => {
    presenceChannel?.members.each(function (member) {
      const userId = member.id;
      const userInfo = member.info;
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        {
          user_id: userId,
          address: userInfo.address,
          username: userInfo.username,
          avatar: userInfo.avatar,
        },
      ]);
    });
  };

  // TODO: Throttle emojis display

  const sendMessage = async (
    message: string,
    type?: NotificationType,
    address?: string
  ) => {
    const composed_message: ChatMessage = {
      sender: account,
      text: message,
      timestamp: new Date().getTime(),
    };

    const notification: Notification = {
      type: type ? type : "message",
      payload: composed_message,
      timestamp: composed_message.timestamp,
      sent: false,
      index: make_id(12),
      channel: currently_playing,
      target: address,
    };

    if (notification.type === "reaction") {
      setLatestReactionMessage(notification);
    } else {
      setMessages([...messages, notification]);
    }
    publish(notification);
  };

  const clearLatestReactionMessage = () => {
    setLatestReactionMessage(null);
  };

  const retrySendMessage = (payload: Notification) => {
    delete payload.retry;
    setNeedsRetry((needsRetry) => {
      // remove this entry
      const new_needs_retry = needsRetry.filter(
        (i) => i.index !== payload.index
      );
      return [...new_needs_retry];
    });
    publish(payload);
  };

  const sendTip = async (
    currency_address: string,
    creator_address: string,
    amount: number | string,
    currency_symbol: string
  ) => {
    let token: TippingCurrencies;
    if (
      currency_address.toUpperCase() ===
      contractAddresses.busdToken[56].toUpperCase()
    ) {
      token = TippingCurrencies.BUSD;
    }
    if (currency_address === "0x0000000000000000000000000000000000000000") {
      token = TippingCurrencies.BNB;
    }
    if (
      currency_address.toUpperCase() ===
      contractAddresses.usdcToken[56].toUpperCase()
    ) {
      token = TippingCurrencies.USDC;
    }
    if (
      currency_address.toUpperCase() ===
      contractAddresses.treat2[56].toUpperCase()
    ) {
      token = TippingCurrencies.TREAT;
    }

    const bal = await balanceOf({
      currency: token,
      interactionType: ContractInteractionTypes.CALL,
    });

    if (parseFloat(Web3.utils.fromWei(bal)) < amount) {
      toast({
        title: "Not Enough Balance!",
        description: `You do not have enough funds in your wallet to send this tip. The contract will fail.`,
        status: "error",
        duration: 3000,
      });
      return;
    }
    amount = Web3.utils.toWei(amount.toString());

    if (currency_address === "0x0000000000000000000000000000000000000000") {
      const sentTip = await treat?.contracts.tippingContract.methods
        .sendTip(
          amount,
          currency_address,
          "0x0E068DBcbc884B81A8A4ECC6F9E4502AD9DF1011"
        )
        .send({
          from: account,
          value: amount,
        });

      if (sentTip) {
        informUserTip(Web3.utils.fromWei(amount), currency_symbol);
        return;
      }
    }
    // if the currency address is TREAT, BUSD, or USDC::
    else {
      // this can be changed with proper typings in an enum
      // temporary workaround until completed.
      switch (token) {
        case TippingCurrencies.BUSD: {
          const currentAllowance = await allowance({
            currency: TippingCurrencies.BUSD,
          });
          if (currentAllowance < Web3.utils.fromWei(amount)) {
            const success = await approval(
              {
                currency: TippingCurrencies.BUSD,
                interactionType: ContractInteractionTypes.SEND,
              },
              amount
            );
            if (success.transactionHash) {
              setTipApproval(true);
            } else {
              setTipApproval(false);
            }
          } else {
            setTipApproval(true);
          }
          break;
        }
        case TippingCurrencies.USDC: {
          const currentAllowance = await allowance({
            currency: TippingCurrencies.USDC,
          });

          if (currentAllowance < Web3.utils.fromWei(amount)) {
            const success = await approval(
              {
                currency: TippingCurrencies.USDC,
                interactionType: ContractInteractionTypes.SEND,
              },
              amount
            );
            if (success.transactionHash) {
              setTipApproval(true);
            } else {
              setTipApproval(false);
            }
          } else {
            setTipApproval(true);
          }
          break;
        }
        case TippingCurrencies.TREAT: {
          const currentAllowance = await allowance({
            currency: TippingCurrencies.TREAT,
          });

          if (currentAllowance < Web3.utils.fromWei(amount)) {
            const success = await approval(
              {
                currency: TippingCurrencies.TREAT,
                interactionType: ContractInteractionTypes.SEND,
              },
              amount
            );
            if (success.transactionHash) {
              setTipApproval(true);
            } else {
              setTipApproval(false);
            }
          } else {
            setTipApproval(true);
          }
        }
      }
    }
    toast({
      title: "Approval",
      description: `You have approved TreatMinter contract.`,
      status: "success",
      duration: 3000,
    });

    if (hasTipApproval) {
      // set time out to remove weird failure sometimes?
      // setTimeout(async function () {
      const sentTip = await treat?.contracts.tippingContract.methods
        .sendTip(
          amount,
          currency_address,
          "0x0E068DBcbc884B81A8A4ECC6F9E4502AD9DF1011"
        )
        .send({
          from: account,
        });

      if (sentTip) {
        informUserTip(Web3.utils.fromWei(amount), currency_symbol);
        return;
      }
    }

    return;
  };

  const informUserTip = (amount: string, currency: string) => {
    // user inform
    sendMessage(`${amount} ${currency} tipped to creator address`, "tip");
    toast({
      title: "Tip sent",
      description: `${amount} ${currency} tipped to creator`,
      status: "success",
      duration: 3000,
    });
  };

  const sendReaction = (message: string) => {
    sendMessage(message, "reaction");
    setIsThrottled(true);
  };

  const publish = (payload: Notification) => {
    if (payload.retry?.remaining_attempts <= 0) {
      // remove from needsRetry to prevent Infinity loop
      setNeedsRetry((needsRetry) => {
        // remove this entry
        const new_needs_retry = needsRetry.filter(
          (i) => i.index !== payload.index
        );
        return [...new_needs_retry];
      });
      return;
    }

    Axios.post(`/api/v2/chat/${currently_playing}/publish`, payload).catch(
      () => {
        console.log(
          `Retrying ${payload.index} for attempt #${payload.retry?.remaining_attempts}`
        );

        if (payload.retry) {
          payload.retry.remaining_attempts--;
          if (payload.retry.remaining_attempts < 0) {
            return;
          }
        }

        const data: Notification = {
          ...payload,
          retry: {
            remaining_attempts: payload.retry
              ? payload.retry.remaining_attempts
              : 3,
            nextAttemptTime: new Date().getTime() + 3000,
          },
        };

        // Update messages with retry
        setMessages((messages) => {
          const index = messages.findIndex((m) => m.index === data.index);
          if (index === -1) {
            return [...messages, data];
          } else {
            const messages_copy = [...messages];
            messages_copy[index] = data;
            return messages_copy;
          }
        });

        setNeedsRetry((items) => {
          const index = items.findIndex((i) => i.index === data.index);
          if (index === -1) {
            return [...items, data];
          } else {
            const items_copy = [...items];
            items_copy[index] = data;
            return items_copy;
          }
        });
      }
    );
  };

  const banAddress = (address: string) => {
    Axios.post(`/api/v2/chat/${currently_playing}/ban`, {
      address,
      toggle: "ban",
      host: account,
    })
      .then(() => {
        sendMessage(`${address} has been banned from chat`, "ban", address);
        setBanned([...banned, address]);
      })
      .catch((err) => {
        console.log({ err });
        sendMessage(`${address} could not be banned from chat`);
      });
  };

  const liftBan = (address: string) => {
    Axios.post(`/api/v2/chat/${currently_playing}/ban`, {
      address,
      toggle: "ban",
      host: account,
    })
      .then(() => {
        sendMessage(`${address} ban has been lifted`, "ban");
        // remove address from banned
        setBanned((banned) => {
          const new_banned = banned.filter((b) => b !== address);
          return new_banned;
        });
      })
      .catch((err) => {
        console.log({ err });
        sendMessage(`${address} ban could not be lifted`);
      });
  };

  const kickout = (address: string) => {
    Axios.post(`/api/v2/chat/${currently_playing}/ban`, {
      address,
      toggle: "ban",
      expires: 24 * 60 * 60 * 1000,
      host: account,
    })
      .then(() => {
        sendMessage(
          `${address} has been kicked out of chat`,
          "kickout",
          address
        ).then(() => {
          toast({
            title: "Kickout",
            description: `${address} has been kicked out of chat`,
            status: "success",
            duration: 3000,
          });
        });
        setBanned([...banned, address]);
      })
      .catch((err) => {
        console.log({ err });
        sendMessage(`${address} ban could not be lifted`);
      });
  };

  useEffect(() => {
    if (currently_playing) {
      getParticipants();
      addMeToParticipants();
    }
    return () => removeMeFromParticipants();
  }, [currently_playing]);

  useEffect(() => {
    // get banned
    if (currently_playing) {
      Axios.get(`/api/v2/chat/${currently_playing}/ban`)
        .then((res) => {
          setBanned(res.data);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [currently_playing]);

  useEffect(() => {
    // if account in banned
    if (banned.indexOf(account) > -1) {
      setIsBanned(true);
    }
  }, [banned, account]);

  useEffect(() => {
    if (needsRetry.length > 0) {
      needsRetry.map((i) => i.retry.remaining_attempts > 0 && publish(i));
    }
  }, [needsRetry]);

  useEffect(() => {
    if (last_message) {
      const index = messages.findIndex((m) => m.index === last_message.index);
      if (index === -1) {
        setMessages([...messages, last_message]);
      } else {
        const messages_copy = [...messages];
        messages_copy[index] = last_message;
        setMessages(messages_copy);
      }

      setLastMessage(null);
    }
  }, [last_message]);

  useEffect(() => {
    if (currently_playing) {
      const current_channel = reactPusher.subscribe(
        `live-${currently_playing}`
      );
      current_channel.bind(
        "ban-event",
        (data: { address: string; event: string; host: string }) => {
          if (data.event === "ban") {
            setBanned([...banned, data.address]);
            account !== data.host &&
              toast({
                title: "Ban",
                description: `${data.address} has been banned from live-stream`,
                status: "warning",
                duration: 3000,
              });
          } else if (data.event === "lift") {
            setBanned((banned) => {
              const new_banned = banned.filter((b) => b !== data.address);
              return new_banned;
            });
            account !== data.host &&
              toast({
                title: "Ban",
                description: `${data.address}'s ban has been lifted`,
                status: "success",
                duration: 3000,
              });
          } else if (data.event === "kickout") {
            setBanned([...banned, data.address]);
            account !== data.host &&
              toast({
                title: "Ban",
                description: `${data.address} has been kicked out from this live-stream`,
                status: "warning",
                duration: 3000,
              });
          }

          if (data.address.toUpperCase() === account.toUpperCase()) {
            router.reload();
          }
        }
      );
      current_channel.bind("live-message", (data: Notification) => {
        setLastMessage(data);
        // set reaction if new message from other senders
        if (data.type === "reaction" && data.payload.sender !== account) {
          setLatestReactionMessage(data);
        } else if (data.type === "tip") {
          toast({
            title: "You have received a tip",
            description: `${
              data.payload.text.split(" ")[0]
            } has been tipped from ${data.payload.sender}`,
            status: "success",
            duration: 3000,
          });
        }
      });

      Axios.post(`/api/v2/chat/${currently_playing}/utils/get_host`, {
        stream_id: currently_playing,
      })
        .then((res) => {
          if (res.data.host) {
            setHost(res.data.host);
          }
        })
        .catch((err) => {
          console.log({ err });
          setHost(null);
        });
    } else {
      if (reactPusher.allChannels().length > 0) {
        reactPusher.unbind_all();
      }
    }
    return () => {
      reactPusher.unbind_all();
    };
  }, [currently_playing]);

  return (
    <LiveStreamChatContext.Provider
      value={{
        messages,
        currently_playing,
        last_message,
        participants,
        isHost,
        host,
        sendMessage,
        sendReaction,
        sendTip,
        setCurrentlyPlaying: setIsPlaying,
        setHost: setIsHost,
        retryMessage: retrySendMessage,
        clearLatestReactionMessage,
        latestReactionMessage,
        isBanned,
        banAddress,
        liftBan,
        kickout,
      }}
    >
      {children}
    </LiveStreamChatContext.Provider>
  );
};
