import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";
import Web3 from "web3";
import { setCookie, destroyCookie } from "nookies";

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

const JWT_KEY = process.env.NEXT_APP_JWT_KEY;

export const isValidSignature = ({ signature, message, address }) => {
  const signer = web3.eth.accounts.recover(message, signature);
  return signer.toUpperCase() === address.toUpperCase();
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
  const { token } = cookies;

  try {
    const session = jwt.verify(token, JWT_KEY);
    req.session = session;
    return handler(req, res);
  } catch (error) {
    try {
      const { refreshToken } = cookies;
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
      console.log({ err });
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
