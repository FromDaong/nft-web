import { Flex, Input, InputGroup } from "@chakra-ui/react";

export default function SendMessageBox() {
  return (
    <Flex className="border border-gray-200" rounded="full" w="full">
      <InputGroup size="sm">
        <Input py={2} px={2} variant="unstyled" placeholder="Comment" />
      </InputGroup>
    </Flex>
  );
}
