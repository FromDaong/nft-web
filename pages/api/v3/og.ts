import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default function () {
  const response = "<></>";
  return new ImageResponse(response);
}
