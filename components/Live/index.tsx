import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default function LiveStreamModal({ isOpen, onClose, data }) {
  const {
    playback_id: playbackId,
    stream_key: streamKey,
    stream_id: streamId,
  } = data;
  return (
    <>
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>End Live</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
