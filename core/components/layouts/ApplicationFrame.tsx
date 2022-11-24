import {
  HomeIcon,
  UserGroupIcon,
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

const ApplicationChildrenContainer = styled("div", {
  marginBottom: "56px",
  width: "100%",
  display: "grid",
});

const Main = styled(Container, {
  width: "56%",
  maxWidth: "640px",
  gap: "4%",
  marginBottom: "56px",
  height: "100%",
  overflowY: "auto",
  overscrollBehaviorY: "contain",
  minHeight: "100vh",
});

const Sidebar = styled("div", {
  width: "280px",
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
  const tabs = [
    {
      label: "Discover",
      href: "",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: "Subscribed",
      href: "/subscribed",
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
    {
      label: "Live",
      href: "/live",
      icon: <VideoCameraIcon className="w-5 h-5" />,
    },
  ];

  const router = useRouter();
  const { pathname } = router;

  const isActive = (href) => pathname === "/discover" + href;

  return (
    <Frame className="relative flex max-w-6xl mx-auto">
      {layout === "collapse" ? (
        <></>
      ) : (
        <Sidebar className="sticky top-0 divide-y">
          <div className="flex flex-col w-full gap-4 py-2">
            {tabs.map((t) => (
              <Link key={t.href} href={`/discover${t.href}`}>
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
          <FeaturedFrame>
            <h4 className="font-semibold">
              <MutedText>Featured trit creators</MutedText>
            </h4>
            {new Array(5).fill(5).map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Avatar />
                <div>
                  <Username>@kamfeskaya</Username>
                  <MutedText>
                    <SmallText>Tatenda Christopher</SmallText>
                  </MutedText>
                </div>
              </div>
            ))}
            <div className="mt-2">
              <BoldLink className="text-pink-500">See more</BoldLink>
            </div>
          </FeaturedFrame>
          <FeaturedFrame>
            <h4 className="font-semibold">
              <MutedText>Trending livestreams</MutedText>
            </h4>
            {new Array(5).fill(5).map((i) => (
              <div key={i} className="flex items-center gap-4">
                <LivestreamingAvatar />
                <div className="w-2/3">
                  <p className="ellipsis truncate ...">
                    <BoldLink>
                      Come hang out with your boy on this thing
                    </BoldLink>
                  </p>
                  <MutedText>
                    <SmallText>@kamfeskaya</SmallText>
                  </MutedText>
                </div>
              </div>
            ))}
            <div className="mt-2">
              <BoldLink className="text-pink-500">See more</BoldLink>
            </div>
          </FeaturedFrame>
        </Sidebar>
      )}
      <Main
        className="flex-1"
        style={layout === "collapse" ? { maxWidth: "100%" } : {}}
      >
        <ApplicationChildrenContainer className="divide-y divide-gray-100">
          {children}
        </ApplicationChildrenContainer>
      </Main>
    </Frame>
  );
}
