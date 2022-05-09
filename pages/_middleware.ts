import { NextRequest } from "next/server";
import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import { jsonResponse } from "@lib/auth/jsonResponse";

export async function middleware(req: NextRequest) {
  // Add the user token to the response
  const { token, refreshToken } = req.cookies;

  try {
    const res = await axios.request({
      method: "POST",
      url: "/api/v2/auth/me?token=" + token,
      adapter: fetchAdapter,
      data: { token, refreshToken },
    });
    const data = await res.data;
  } catch (err) {
    console.log("An error occured");
  }
}
