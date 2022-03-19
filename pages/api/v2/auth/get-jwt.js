import { destroyCookie, setCookie } from "nookies";
import {
  destroyNextCookie,
  isValidSignature,
  signJWT,
} from "../../../../utils/server-utils";

export default async function get_jwt(req, res) {
  const payload = req.body;

  /* Sign token */
  if (!payload) {
    destroyNextCookie({ res }, "token");
    res.status(401).send("You are not authorized");
  } else {
    const { ethAddress, sessionToken, username } = payload;
    const { signature, data } = payload.authData.moralisEth;

    const isValid = isValidSignature({
      message: data,
      signature,
      address: ethAddress,
    });

    if (!isValid) {
      destroyCookie({ res }, "token");
      res.status(401).send("You are not authorized");
    } else {
      try {
        const data = { ethAddress, sessionToken, username };
        const accessToken = signJWT(data, "1m");
        const refreshToken = signJWT({ sessionToken }, "3d");

        setCookie({ res }, "token", accessToken, {
          maxAge: 24 * 60 * 60,
          path: "/",
        });
        setCookie({ res }, "refreshToken", refreshToken, {
          maxAge: 3 * 24 * 60 * 60,
          path: "/",
        });

        res.status(200).json({
          accessToken,
          refreshToken,
        });
      } catch (err) {
        console.log({ err });
        res
          .status(401)
          .json({ error: true, message: "Failed to authenticate" });
      }
    }
  }
}
