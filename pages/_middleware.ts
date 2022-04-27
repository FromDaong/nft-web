import Axios from "axios";
import { jwt } from "jsonwebtoken";
import logger from "../lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const signJWT = (data, expiresIn) => {
  return jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: expiresIn ?? "3d",
  });
};

const refreshMyToken = (token, refreshToken) => {
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
    logger({ err });
    return false;
  }
};

export async function middleware(req: NextRequest) {
  // Add the user token to the response
  const { token, refreshToken, account } = req.cookies;
  const url = req.nextUrl;

  url.pathname = `/auth/`;
  if (!token) {
    return NextResponse.redirect(url);
  }

  if (!isValidToken(token)) {
    if (refreshToken && isValidToken(refreshToken)) {
      refreshMyToken(token, refreshToken);
    }
    const res = await Axios.get("/api/v2/auth/me");

    if (!res.data) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify({ modelData: res.data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
