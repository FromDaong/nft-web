import { NextRequest } from "next/server";
import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

export async function middleware(req: NextRequest) {
  // Add the user token to the response
  const { token, refreshToken } = req.cookies;

  try {
    await axios.request({
      method: "POST",
      url: "/api/v2/auth/me?token=" + token,
      adapter: fetchAdapter,
      data: { token, refreshToken },
    });
  } catch (err) {
    console.log("An error occured");
  }
}
