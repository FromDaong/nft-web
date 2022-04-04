import { parseCookies, setCookie } from "nookies";

import Model from "../../models/Model";
import jwt from "jsonwebtoken";
import { signJWT } from "../../utils/server-utils";

export const onlyQueryProps = (ctx: { query: any }) => ({
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

export const redirectToPage = ({ page, redirectTo }) => ({
  redirect: {
    permanent: false,
    destination: `${page}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`,
  },
  props: { redirectTo },
});

const returnProps = (props) => ({
  props: { ...props },
});

const refreshToken = (token, refreshToken) => {
  try {
    jwt.verify(refreshToken, process.env.NEXT_APP_JWT_KEY);
    const expiredToken = jwt.verify(token, process.env.NEXT_APP_JWT_KEY, {
      ignoreExpiration: true,
    });

    delete expiredToken.exp;

    const accessToken = signJWT(expiredToken, "1m");
    const newRefreshToken = signJWT(
      { sessionToken: expiredToken.sessionToken },
      "3d"
    );

    return {
      accessToken,
      newRefreshToken,
    };
  } catch (err) {
    return { error: err };
  }
};

const isValidToken = (token) => {
  try {
    jwt.verify(token, process.env.NEXT_APP_JWT_KEY);
    return true;
  } catch (err) {
    console.log({ err });
    return false;
  }
};

export const enforceAuth = async (ctx) => {
  try {
    const cookies = parseCookies(ctx);
    if (!cookies.token)
      return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
    if (isValidToken(cookies.token)) {
      return returnProps({});
    } else if (cookies.refreshToken) {
      const { newRefreshToken, accessToken } = refreshToken(
        cookies.token,
        cookies.refreshToken
      );

      setCookie(ctx, "token", accessToken, {
        maxAge: 60 * 60,
        path: "/",
      });

      setCookie(ctx, "refreshToken", newRefreshToken, {
        maxAge: 3 * 24 * 60 * 60,
        path: "/",
      });

      return returnProps({});
    } else {
      return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
    }
  } catch (err) {
    console.log({ err });
    return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
  }
};

export const getModelData = async (ctx) => {
  try {
    const cookies = parseCookies(ctx);
    console.log(
      isValidToken(cookies.token),
      isValidToken(cookies.refreshToken)
    );
    if (!cookies.token) {
      return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
    }
    if (isValidToken(cookies.token)) {
      const address = jwt.verify(cookies.token, process.env.NEXT_APP_JWT_KEY, {
        ignoreExpiry: true,
      }).ethAddress;
      const userInfo = await Model.findOne({
        address: { $regex: new RegExp(address, "i") },
      });
      return returnProps({
        userInfo: JSON.stringify(
          userInfo ?? {
            bio: "I am a new Treat explorer",
            nfts: [],
            username: address.substring(0, 6) + "..." + address.substr(-5),
            address,
          }
        ),
      });
    } else if (isValidToken(cookies.refreshToken)) {
      const address = jwt.verify(cookies.token, process.env.NEXT_APP_JWT_KEY, {
        ignoreExpiry: true,
      }).ethAddress;
      const userInfo = await Model.findOne({
        address: { $regex: new RegExp(address, "i") },
      });

      return returnProps({
        userInfo: JSON.stringify(
          userInfo ?? {
            bio: "I am a new Treat explorer",
            nfts: [],
            username: address.substring(0, 6) + "..." + address.substr(-5),
            address,
          }
        ),
      });
    }

    return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
  } catch (err) {
    console.log({ err });
    return redirectToPage({ page: "/auth", redirectTo: ctx.resolvedUrl });
  }
};
