import {
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import ChatBox from "./Chat";
import LiveVideo from "./Video";
import Participants from "./Participants";

export default function LiveStreamModal({
  isOpen,
  onClose,
  data,
  streamIsActive,
}) {
  const { playback_id, stream_id } = data;

  const endStream = async () => {
    await fetch(`/api/stream/${stream_id}/end`);
    //mutate("/api/dashboard/stream");
  };

  return (
    <>
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Livestream</ModalHeader>
          <ModalBody h={"full"} position="relative">
            <Flex flexDir="column" w={"full"} h={"full"} position="absolute">
              <Grid
                gridTemplateColumns={"repeat(5, 1fr)"}
                w={"full"}
                h={"full"}
              >
                <GridItem colSpan={1} h={"full"}>
                  <Participants />
                </GridItem>
                <GridItem colSpan={3} h={"full"} bgColor="black">
                  <LiveVideo
                    streamIsActive={streamIsActive}
                    playback_id={playback_id}
                  />
                </GridItem>
                <GridItem colSpan={1} h={"full"}>
                  <ChatBox />
                </GridItem>
              </Grid>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"flex-start"}>
            <Button colorScheme={"red"} onClick={onClose}>
              End Livestream
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
