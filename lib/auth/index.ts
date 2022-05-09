import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

import { jsonResponse } from "@lib/auth/jsonResponse";
import { nanoid } from "nanoid";

const JWT_SECRET_KEY = process.env.JWT_KEY;
const USER_TOKEN = "token";
const REFRESH_TOKEN = "refreshToken";

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies[USER_TOKEN];

  if (!token) {
    return jsonResponse(401, { error: { message: "Missing user token" } });
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );
    return verified.payload;
  } catch (err) {
    return jsonResponse(401, { error: { message: "Your token has expired." } });
  }
}
