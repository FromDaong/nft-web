import axios from "axios";

console.log(process.env.NODE_ENV);

export const axiosNode =
  process.env.NODE_ENV !== "development"
    ? axios
    : axios.create({
        baseURL: "http://localhost:3000",
      });

export const getJWT = (payload) => {
  return axios.post("/api/v2/auth/get-jwt", payload);
};
