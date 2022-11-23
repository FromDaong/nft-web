import { ComponentBasicProps } from "core/TreatCore";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "../Container";
import { BoldLink, ImportantSmallText } from "../Typography/Text";

export const TabsContainer = ({ children }: ComponentBasicProps) => {
  return (
    <Container
      css={{ borderBottom: "1px solid $subtleBorder" }}
      variant={"unstyled"}
      className="flex w-full gap-x-4 flex-start"
    >
      {children}
    </Container>
  );
};

export const Tab = ({ label, href }: { label: string; href: string }) => {
  const { asPath } = useRouter();
  const isActive = asPath === href;

  return (
    <Container
      css={{ margin: 0 }}
      variant={"tab"}
      state={isActive ? "active" : "default"}
      className={`relative`}
    >
      <Link href={href}>
        <a>
          <ImportantSmallText
            css={{ color: isActive ? "$accentText" : "$text" }}
          >
            {label}
          </ImportantSmallText>
        </a>
      </Link>
    </Container>
  );
};
