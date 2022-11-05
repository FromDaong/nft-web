import {
  HomeIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { Container } from "@packages/shared/components/Container";
import {
  BoldLink,
  MutedParagraph,
  SmallText,
  Username,
} from "@packages/shared/components/Typography/Text";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";
import Link from "next/link";
import { useRouter } from "next/router";
import FeaturedFrame from "./FeaturedFrame";
import * as Avatar from "@radix-ui/react-avatar";

const ApplicationChildrenContainer = styled("div", {
  marginTop: "12px",
  marginBottom: "56px",
  width: "100%",
  gap: "3em",
  display: "grid",
});

const Main = styled(Container, {
  width: "56%",
  gap: "4%",
});

const Sidebar = styled("div", {
  width: "36%",
  marginTop: "12px",
  marginBottom: "56px",
  gap: "20px",
});

export default function ApplicationFrame({ children }: ComponentBasicProps) {
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

  const isActive = (href) => pathname === "/fyp" + href;

  return (
    <Container className="flex max-w-6xl mx-auto">
      <Sidebar className="divide-y">
        <div className="flex flex-col w-full gap-4 py-2">
          {tabs.map((t) => (
            <div
              key={t.href}
              className={`px-4 py-1 rounded-xl ${
                isActive(t.href) ? "text-pink-600" : ""
              } hover:bg-gray-100`}
            >
              <Link href={`/fyp/${t.href}`}>
                <a className="flex items-center gap-4 text-2xl font-bold">
                  {t.icon}
                  <span>{t.label}</span>
                </a>
              </Link>
            </div>
          ))}
        </div>
        <FeaturedFrame>
          <h4 className="font-semibold">
            <MutedParagraph>Featured trit creators</MutedParagraph>
          </h4>
          {new Array(5).fill(5).map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Avatar.Root className="rounded-full">
                <Avatar.Image
                  className="object-cover w-10 h-10 rounded-full shadow-md"
                  src="/assets/KristinCover.jpg"
                />
                <Avatar.Fallback className="rounded-full shadow-xl ">
                  <p className="flex items-center justify-center w-10 h-10 bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700">
                    TR
                  </p>
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <Username>@kamfeskaya</Username>
                <MutedParagraph>
                  <SmallText>Tatenda Christopher</SmallText>
                </MutedParagraph>
              </div>
            </div>
          ))}
          <div className="mt-2">
            <BoldLink className="text-pink-500">See more</BoldLink>
          </div>
        </FeaturedFrame>
        <FeaturedFrame>
          <h4 className="font-semibold">
            <MutedParagraph>Trending livestreams</MutedParagraph>
          </h4>
        </FeaturedFrame>
      </Sidebar>
      <Main>
        <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
      </Main>
    </Container>
  );
}
