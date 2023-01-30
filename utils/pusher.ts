import Pusher from "pusher-js";

const pusherClient = new Pusher("68ea1848874450546ae7", {
	cluster: "us2",
});

export default pusherClient;
