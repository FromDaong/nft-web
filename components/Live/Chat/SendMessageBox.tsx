import { Box, Button, Flex, Input, InputGroup } from "@chakra-ui/react";

import { SendFill } from "react-bootstrap-icons"
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
  return (
    <Box w="full">
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
              placeholder="Comment"
              color="gray.700"
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
    </Box>
  );
}
