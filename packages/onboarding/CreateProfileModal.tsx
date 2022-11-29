import { Button } from "@packages/shared/components/Button";
import { Container } from "@packages/shared/components/Container";
import { Text } from "@packages/shared/components/Typography/Text";
import * as Dialog from '@radix-ui/react-dialog';

export default function CreateProfileModal() {
    return(
        <Dialog.Root>
            <Dialog.Trigger />
            <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
                <Dialog.Title>
                    Complete your profile
                </Dialog.Title>
                <Dialog.Close />
                <Container className="gap-8">
                    <Container className="relative flex flex-col gap-4"></Container>
                    <Container className="flex gap-4">
                        <Container className="flex flex-col gap-2">
                            <Text>Personal information</Text>
                            <Container className="gap-1 flex flex-col">
                                <Text>Username</Text>
                                <input className="w-full" />
                            </Container>
                            <Container className="gap-1 flex flex-col">
                                <Text>Display name</Text>
                                <input className="w-full" />
                            </Container>
                            <Container className="gap-1 flex flex-col">
                                <Text>About me</Text>
                                <textarea className="w-full" />
                            </Container>
                        </Container>
                    </Container>

                    <Container className="flex gap-4">
                        <Container className="flex flex-col gap-2">
                            <Text>Links</Text>
                            <Container className="gap-1 flex flex-col">
                                <Text>Website</Text>
                                <input className="w-full" />
                            </Container>
                            <Container className="gap-1 flex flex-col">
                                <Text>Twitter</Text>
                                <input className="w-full" />
                            </Container>
                            <Container className="gap-1 flex flex-col">
                                <Text>Instagram</Text>
                                <input className="w-full" />
                            </Container>
                        </Container>
                    </Container>

                    <Button>
                        Set up my profile
                    </Button>
                </Container>
            </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}