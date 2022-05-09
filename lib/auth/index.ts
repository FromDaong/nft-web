import { NextRequest } from "next/server";
import { jsonResponse } from "@lib/auth/jsonResponse";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_KEY;
const USER_TOKEN = "token";

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
