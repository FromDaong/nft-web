import { Box, Button, Flex, Input, InputGroup } from "@chakra-ui/react";

import { useState } from "react";

export default function SendMessageBox() {
  const [value, setValue] = useState("");

  const onMessageChange = (e) => {
    const val = e.target.value;
    setValue(val);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    const message = value;
    setValue("");
  };
  return (
    <Box w="full">
      <form onSubmit={onSubmit} className="w-full">
        <Flex className="border border-gray-200" rounded="full" w="full">
          <InputGroup size="sm">
            <Input
              py={2}
              px={2}
              variant="unstyled"
              placeholder="Comment"
              color="gray.200"
              value={value}
              onChange={onMessageChange}
            />
          </InputGroup>
          <Button
            disabled={!value}
            size="sm"
            my="auto"
            rounded="full"
            type="submit"
            colorScheme={"primary"}
            px={[2, 3, 3, 4]}
            mr={1}
          >
            Send
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
