import {returnWithError} from "@db/engine/utils";
import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
import {getSession} from "next-auth/react";

export const onlyQueryProps = (ctx: {query: any}) => ({
	props: {
		query: ctx.query,
	},
});

export const blankServerProps = {
	props: {},
};

export const withDataProps = (data: any): object => {
	return {
		props: {
			...data,
		},
	};
};

export const redirectToPage = ({page, redirectTo}) => ({
	redirect: {
		permanent: false,
		destination: `${page}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`,
	},
	props: {redirectTo},
});

export const returnProps = (props) => ({
	props: {...props},
});

export const protectedAPIRoute = (handler) => async (req, res) => {
	const session = await getSession({req});
	if (!session) {
		return returnWithError("Thou shalt not pass", 401, res);
	}

	req.session = {
		...session,
		// @ts-ignore
		address: session.address.toLowerCase(),
	};

	return handler(req, res);
};

import {NextApiRequest, NextApiResponse} from "next";
type Middleware = (req: NextApiRequest, res: NextApiResponse) => unknown;

/**
 * @name withMiddleware
 * @description combine multiple middleware before handling your API endpoint
 * @param middlewares
 */
export function withMiddleware(...middlewares: Middleware[]) {
	return async function withMiddlewareHandler(
		req: NextApiRequest,
		res: NextApiResponse
	) {
		async function evaluateHandler(
			middleware: Middleware,
			innerMiddleware?: Middleware
		) {
			// return early when the request has
			// been ended by a previous middleware
			if (res.headersSent) {
				return;
			}

			if (typeof middleware === "function") {
				const handler = await middleware(req, res);

				if (typeof handler === "function") {
					if (innerMiddleware) {
						await handler(innerMiddleware);

						const index = middlewares.indexOf(innerMiddleware);

						// remove inner middleware
						if (index >= 0) {
							middlewares.splice(index, 1);
						}
					} else {
						await handler();
					}
				}
			}
		}

		for (let index = 0; index < middlewares.length; index++) {
			const middleware = middlewares[index];
			const nextMiddleware = middlewares[index + 1];

			await evaluateHandler(middleware, nextMiddleware);
		}
	};
}

export const protectRoute = (handler) => {
	console.log(handler);
	return withIronSessionApiRoute(protectedAPIRoute(handler), ironOptions);
};

export const requireApiAuth = (req, res) => {
	if (!req.session.siwe) {
		returnWithError("Not logged in", 401, res);
	}
};
