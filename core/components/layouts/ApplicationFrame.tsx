import {
  ChatAltIcon,
  HomeIcon,
  MapIcon,
  UserGroupIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { Container } from "@packages/shared/components/Container";
import {
  BoldLink,
  SmallText,
  Username,
  MutedText,
} from "@packages/shared/components/Typography/Text";
import { styled } from "@styles/theme";
import { ComponentBasicProps } from "core/TreatCore";
import Link from "next/link";
import { useRouter } from "next/router";
import FeaturedFrame from "./FeaturedFrame";
import Avatar, {
  LivestreamingAvatar,
} from "@packages/shared/components/Avatar";
import { ImageIcon } from "@radix-ui/react-icons";
import { CashIcon } from "@heroicons/react/solid";

const ApplicationChildrenContainer = styled("div", {
  marginBottom: "56px",
  width: "100%",
  display: "grid",
});

const Main = styled(Container, {
  maxWidth: "1024px",
  gap: "4%",
  marginBottom: "56px",
  height: "100%",
  overflowY: "auto",
  overscrollBehaviorY: "contain",
  minHeight: "100vh",
});

const Sidebar = styled("div", {
  width: "180px",
  gap: "20px",
  height: "100vh",
  marginTop: "-128px",
  overflowY: "auto",
  overscrollBehaviorY: "contain",
  minHeight: "100%",
  paddingTop: "64px",
});

const Frame = styled("div", {
  position: "relative",
});

export default function ApplicationFrame({
  children,
  layout,
}: ComponentBasicProps & { layout?: "normal" | "collapse" }) {
  const tabs = (meta: { username: string }) => [
    {
      label: "Home",
      href: "/discover",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: "Explore",
      href: "/discover/explore",
      icon: <MapIcon className="w-5 h-5" />,
    },
    {
      label: "Subscribed",
      href: "/discover/subscribed",
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
    {
      label: "Live",
      href: "/discover/live",
      icon: <VideoCameraIcon className="w-5 h-5" />,
    },
    {
      label: "Sweetshop",
      href: "/sweetshop",
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: <ChatAltIcon className="w-5 h-5" />,
    },
    {
      label: "Profile",
      href: `/${meta.username}`,
      icon: <UserIcon className="w-5 h-5" />,
    },
  ];

  const router = useRouter();
  const { pathname } = router;

  const isActive = (href) => pathname === href;

  return (
    <Frame className="relative flex max-w-6xl mx-auto">
      {layout === "collapse" ? (
        <></>
      ) : (
        <Sidebar className="sticky top-0 divide-y">
          <div className="flex flex-col w-full gap-4 py-2">
            {tabs({ username: "tate2301" }).map((t) => (
              <Link key={t.href} href={`${t.href}`}>
                <a
                  key={t.href}
                  className={`px-4 py-1 rounded-xl ${
                    isActive(t.href) ? "text-pink-600" : ""
                  } hover:bg-gray-100 flex items-center gap-4 text-2xl font-bold`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </Sidebar>
      )}
      <Main
        className="flex-1"
        style={layout === "collapse" ? { maxWidth: "100%" } : {}}
      >
        <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
      </Main>
    </Frame>
  );
}
