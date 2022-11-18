import { useRouter } from "next/router";
import { useState } from "react";
import useDisclosure from "./useDisclosure";

export { useDisclosure };

export const useDeveloperTools = () => {
  const [designMode, setDesignMode] = useState(false);
  const [currentEnv, setCurrentEnv] = useState<string>("");
  const router = useRouter();

  const setEnviroment = (env: "dev" | "prod") => {
    if (env === "dev") {
      setCurrentEnv("http://localhost:3000");
    } else if (env === "prod") {
      setCurrentEnv("https://treatnfts.com");
    }
  };

  const openPageInEnviroment = (env: "dev" | "prod") => {
    if (env === "dev") {
      router.push("http://localhost:3000/" + router.pathname);
    } else if (env === "prod") {
      router.push("http://treatnfts.com/" + router.pathname);
    }
  };

  const toggleDesignMode = (state?: boolean) => {
    if (designMode === state) return;
    if (typeof document === "undefined") {
      return;
    }

    if (state) {
      document.designMode = state ? "on" : "off";
      setDesignMode(state);
    }
    if (designMode) {
      document.designMode = "off";
      setDesignMode(false);
    } else {
      document.designMode = "on";
      setDesignMode(true);
    }
  };

  return {
    toggleDesignMode,
    setEnviroment,
    openPageInEnviroment,
    designMode,
    currentEnv,
  };
};
