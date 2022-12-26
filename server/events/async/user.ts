import {createStepFunction} from "inngest";
// This is the data received whenever the `cart/product.added` event is received.
type Added = {
	name: "user/profile.email_added";
	data: {
		email: string;
		referral_code: string;
	};
	user: {
		address: string;
	};
};

export const createStepFnForRefferals = () =>
	createStepFunction<Added>(
		"user/email.added",
		// @ts-ignore
		({event, tools}) => {
			const newUserJoinedWithReferral = tools.waitForEvent(
				"user/profile.created",
				{
					timeout: "24h",
					match: "data.referral_code",
				}
			);

			if (newUserJoinedWithReferral !== null) {
				return;
			}
			tools.run("Send reminder", () => {
				const sendReminderToReferFriends = (p) => p;
				sendReminderToReferFriends({
					email: event.user.email,
					cart: event.data.cart_id,
				});
			});
		},
		{
			cancellation: {
				event: "user/profile.created",
				timeout: "24h",
				match: "data.referral_code",
			},
		}
	);
