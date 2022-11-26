import { useRouter } from "next/router";

export const useIsRouteActive = () => {
  const router = useRouter();
  const { pathname } = router;
  const isActive = (href) => pathname === href;
  return {
    isActive,
  };
};
