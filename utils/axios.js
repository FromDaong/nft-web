import axios from "axios";

export const axiosNode =
  process.env.NODE_ENV !== "development"
    ? axios
    : axios.create({
        baseURL: "http://localhost:3000",
      });

export const getJWT = (payload) => {
  return axios
    .post("/api/v2/auth/get-jwt", payload)
    .then((res) => localStorage.setItem("tokens", JSON.stringify(res.data)));
};
