import { destroyNextCookie, signJWT } from "../../../../utils/server-utils";

import { setCookie } from "nookies";

export default async function get_jwt(req, res) {
  const payload = req.body;

  /* Sign token */
  if (!payload) {
    destroyNextCookie({ res }, "token");
    res.status(401).send("You are not authorized");
  } else {
    const { ethAddress, sessionToken, username } = payload;

    try {
      const data = {
        ethAddress: `${ethAddress}`.toLowerCase(),
        sessionToken,
        username,
      };
      const accessToken = signJWT(data, "15m");
      const refreshToken = signJWT({ ...data }, "30d");

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
      res.status(401).json({ error: true, message: "Failed to authenticate" });
    }
  }
}
