import {
  ChatMessage,
  ChatParticipant,
  Notification,
  NotificationType,
} from "../../components/Live/types";
import { createContext, useContext, useEffect, useState } from "react";

import Axios from "axios";
import { Context } from "../TreatProvider";
import Web3 from "web3";
import { make_id } from "../../components/Live/utils";
import { reactPusher } from "../../lib/pusher";
import { useMoralis } from "react-moralis";
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
});

export const LiveStreamChatContextProvider = ({ children }) => {
  const { Moralis, web3 } = useMoralis();
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
  const [isThrottled, setIsThrottled] = useState(false);
  const [latestReactionMessage, setLatestReactionMessage] = useState(null);

  const { account } = useMoralis();
  const { treat } = useContext(Context);
  const toast = useToast();

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
      console.log({ me });

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
      console.log({ member });
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

  const sendMessage = async (message: string, type?: NotificationType) => {
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
    };

    setMessages([...messages, notification]);
    setLatestReactionMessage(notification);
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
    amount: number,
    currency: string
  ) => {
    // Check if the address is 0x00 (BNB), if it is, send with value attached to tip:
    if (currency_address === "0x0000000000000000000000000000000000000000") {
      await treat?.contracts.tippingContract.methods
        .sendTip(
          Web3.utils.toWei(`${amount}`),
          currency_address,
          creator_address
        )
        .send({
          from: account,
          value: Web3.utils.toWei(amount.toString()),
        });
    }
    // if the currency address is TREAT, BUSD, or USDC::
    else {
      // FIRST GET APPROVAL FROM CURRENCY CONTRACT...
      // Instantiate new contract using generic BEP20 ABI
      // Call new token to approve the treat contract
      // then execute the transaction

      await treat?.contracts.tippingContract.methods
        .approve(treat.contracts.tippingContract, Web3.utils.toWei(`${amount}`))
        .send({ from: account });

      // wait until the approval is completed before sending the tip

      await treat?.contracts.tippingContract.methods
        .sendTip(
          Web3.utils.toWei(`${amount}`),
          currency_address,
          creator_address
        )
        .send({
          from: account,
        });

      // will not take any BNB since no value is attached ^-^
    }

    // user inform
    sendMessage(`${amount}{currency} tipped to creator address`, "tip");
    toast({
      title: "Tip sent",
      description: `${amount}{currency} tipped to creator`,
      status: "success",
      duration: 3000,
    });
    return;
  };

  const sendReaction = (message: string) => {
    sendMessage(message);
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
      (err) => {
        console.log({ err });
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

  useEffect(() => {
    if (currently_playing) {
      getParticipants();
      addMeToParticipants();
    }
    return () => removeMeFromParticipants();
  }, [currently_playing]);

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

  console.log({ host });

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
      }}
    >
      {children}
    </LiveStreamChatContext.Provider>
  );
};
