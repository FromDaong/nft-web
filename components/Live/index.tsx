import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import LiveVideo from "./Video";

export default function LiveStreamModal({
  isOpen,
  onClose,
  data,
  streamIsActive,
}) {
  const { playback_id, stream_id } = data;

  const endStream = async () => {
    await fetch(`/api/stream/${stream_id}/end`);
    onClose();
    //mutate("/api/dashboard/stream");
  };

  return (
    <>
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Livestream</ModalHeader>
          <ModalBody h={"full"} position="relative">
            <LiveVideo
              streamIsActive={streamIsActive}
              playback_id={playback_id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
