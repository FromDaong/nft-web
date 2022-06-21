import { destroyCookie, setCookie } from "nookies";

import jwt from "jsonwebtoken";
import logger from "../lib/logger";
import { parseCookies } from "nookies";
import { web3 } from "./moralis";

const JWT_KEY = process.env.NEXT_APP_JWT_KEY;
export const isValidSignature = ({ signature, message, address }) => {
  const signer = web3.eth.accounts.recover(message, signature);
  return signer.toLowerCase() === address.toLowerCase();
};

export const setNextCookie = (res, name, data, maxAge?) => {
  setCookie({ res }, name, data, {
    maxAge: maxAge ?? 30 * 24 * 60 * 60,
    path: "/",
  });
};

export const destroyNextCookie = (res, name) => {
  destroyCookie({ res }, name);
};

export const signJWT = (data, expiresIn) => {
  return jwt.sign(data, JWT_KEY, {
    expiresIn: expiresIn ?? "3d",
  });
};

export const withJWTAuth = (handler) => (req, res) => {
  const cookies = parseCookies({ req });
  let { token, refreshToken } = cookies;
  if (!token) {
    token = req.query.token;
  }

  if (!refreshToken) {
    refreshToken = req.query.refreshToken;
  }

  try {
    const session = jwt.verify(token, JWT_KEY);
    // Capitalize address
    session.ethAddress = `${session.ethAddress}`.toLowerCase();
    req.session = session;
    return handler(req, res);
  } catch (error) {
    try {
      jwt.verify(refreshToken, JWT_KEY);

      const expiredToken = jwt.verify(token, JWT_KEY, {
        ignoreExpiration: true,
      });

      delete expiredToken.exp;

      const accessToken = signJWT(expiredToken, "15m");
      const newRefreshToken = signJWT(
        { sessionToken: expiredToken.sessionToken },
        "3d"
      );

      setCookie({ res }, "token", accessToken, {
        maxAge: 24 * 60 * 60,
        path: "/",
      });
      setCookie({ res }, "refreshToken", newRefreshToken, {
        maxAge: 3 * 24 * 60 * 60,
        path: "/",
      });

      req.session = expiredToken;

      return handler(req, res);
    } catch (err) {
      logger(err);
      res.status(401).json({
        error: true,
        message: {
          token: error,
          refreshToken: err,
        },
      });
    }
  }
};

export const getSessionFromToken = ({ req, ctx }) => {
  if (req) {
    const cookies = parseCookies({ req });
    const { token } = cookies;
    try {
      const session = jwt.verify(token, JWT_KEY);
      return { ...session };
    } catch (_) {
      try {
        const { refreshToken } = cookies;
        jwt.verify(refreshToken, JWT_KEY);
        return { ...jwt.verify(token, JWT_KEY, { ignoreExpiry: true }) };
      } catch (_) {
        return null;
      }
    }
  } else if (ctx) {
    return {
      ethAddress: "null",
      error: "Context not yet supported",
    };
  } else {
    return {
      ethAddress: "null",
      error: "Invalid JWT token",
    };
  }
};
