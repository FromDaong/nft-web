import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest, res: NextResponse) {
  // Add the user token to the response
  const { token, refreshToken } = req.cookies;
}
