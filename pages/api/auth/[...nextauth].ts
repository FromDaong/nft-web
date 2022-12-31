import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {getCsrfToken} from "next-auth/react";
import {
	MongoModelCreator,
	MongoModelProfile,
	MongoModelUser,
} from "server/helpers/models";
import {SiweMessage} from "siwe";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
	const providers = [
		CredentialsProvider({
			name: "Ethereum",
			credentials: {
				message: {
					label: "Message",
					type: "text",
					placeholder: "0x0",
				},
				signature: {
					label: "Signature",
					type: "text",
					placeholder: "0x0",
				},
			},
			async authorize(credentials) {
				try {
					const siwe = new SiweMessage(
						JSON.parse(credentials?.message || "{}")
					);
					const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

					const result = await siwe.verify({
						signature: credentials?.signature || "",
						domain: nextAuthUrl.host,
						nonce: await getCsrfToken({req}),
					});

					if (result.success) {
						return {
							id: siwe.address.toLowerCase(),
						};
					}
					return null;
				} catch (e) {
					return null;
				}
			},
		}),
	];

	const isDefaultSigninPage =
		req.method === "GET" && req.query.nextauth.includes("signin");

	// Hide Sign-In with Ethereum from default sign page
	if (isDefaultSigninPage) {
		providers.pop();
	}

	return await NextAuth(req, res, {
		providers,
		session: {
			strategy: "jwt",
		},
		secret: process.env.NEXTAUTH_SECRET,
		callbacks: {
			async session({session, token}: {session: any; token: any}) {
				const profile =
					(await MongoModelProfile.findOne({address: token.sub})) ?? {};
				const creator = await MongoModelCreator.findOne({
					profile: profile._id,
				});

				session.creator = creator;
				session.address = token.sub;
				session.profile = profile._id ? profile : null;
				session.user.name = token.sub;
				session.user.image = "https://www.fillmurray.com/128/128";
				return session;
			},
		},
	});
}
