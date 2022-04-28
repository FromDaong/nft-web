import Axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

const treatAxios = Axios.create({
  adapter: fetchAdapter,
});

export default treatAxios;
