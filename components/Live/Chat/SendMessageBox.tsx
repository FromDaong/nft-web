import { Box, Button, Flex, Input, InputGroup } from "@chakra-ui/react";

import { SendFill } from "react-bootstrap-icons";
import { useState } from "react";

export default function SendMessageBox(props) {
  const [value, setValue] = useState("");

  const onMessageChange = (e) => {
    const val = e.target.value;
    setValue(val);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    const message = value;
    props.sendMessage(message);
    setValue("");
  };

  console.log({ props });
  return (
    <Box w="full pb-2">
      <form onSubmit={onSubmit} className="w-full">
        <Flex
          className="border border-primary stream-chat-input"
          rounded="full"
          w="full"
        >
          <InputGroup size="sm">
            <Input
              py={2}
              px={4}
              variant="unstyled"
              placeholder={
                props.currently_playing
                  ? "Comment"
                  : "Chat will be enabled when stream is active"
              }
              color="gray.700"
              disabled={!props.currently_playing}
              value={value}
              onChange={onMessageChange}
            />
          </InputGroup>
          <Button
            disabled={!value || !props.currently_playing}
            size="md"
            my="auto"
            rounded="full"
            type="submit"
            colorScheme={"primary"}
            px={[2, 3, 3, 4]}
          >
            <SendFill />
          </Button>
        </Flex>
      </form>
      <Button rounded="full" size="md" my="auto" ml={2}>
        ❤️
      </Button>
    </Box>
  );
}
