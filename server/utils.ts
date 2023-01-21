import {returnWithError} from "@db/engine/utils";
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
