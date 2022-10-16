import { init } from "commandbar";

export default function commandbar(): typeof init {
  return init;
}

commandbar("INIT_ORG");
