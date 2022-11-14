import { prisma } from "@db/engine";
import { SEOHead } from "@packages/seo/page";
import { Button } from "@packages/shared/components/Button";
import { ShortDivider } from "@packages/shared/components/Divider";
import MagazineCard from "@packages/shared/components/MagazineCard";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import { Magazine } from "@prisma/client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function MagazinePage({
  magazines,
  error,
  trace,
}: {
  magazines: Array<Magazine>;
  error: boolean;
  trace: any;
}) {
  const signUpForNewsletter = () => {
    // TODO: Implement newsletter signup
  };

  if (error) {
    return (
      <>
        <SEOHead title="An error occured" />
        <div className="py-8">
          <h2 className="mb-1 text-xl font-medium text-gray-900">
            An error occurred loading the page
          </h2>
          <p className="">{JSON.stringify(trace)}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col py-16 mt-16">
        <h1
          className="max-w-3xl mx-auto mb-4 font-bold tracking-tighter text-center text-8xl"
          style={{
            transformStyle: "flat",
          }}
        >
          Meet the
          <br /> Treat Magazine
        </h1>
        <p className="max-w-xl mx-auto text-xl text-center">
          Get a curated publication by Treat DAO featuring one creator each
          month, directly into your inbox.
        </p>
        <div className="w-full max-w-xl mx-auto mt-8 cta">
          <div className="flex flex-col gap-4">
            <form className="flex w-full gap-4" onSubmit={signUpForNewsletter}>
              <input
                required
                className="flex-1 px-4 py-2 border border-gray-300 shadow shadow-slate-500/10 rounded-xl"
                placeholder="Enter your email"
              />
              <Button>Send me updates</Button>
            </form>
          </div>
        </div>
      </div>
      <ShortDivider dir="vertical" />
      <div className="max-w-xl py-16 mx-auto">
        <div className="relative w-full border shadow-xl overflow-clip rounded-xl ">
          <Link href={magazines[0].href}>
            <a target={"_blank"} rel="noopener">
              <div className="h-[512px] lg:h-[800px] hover:lg:scale(110) transition-scale duration-120">
                <OptimizedImage
                  src={magazines[0].cover}
                  alt={magazines[0].title}
                  layout="fill"
                />
              </div>
            </a>
          </Link>
        </div>
      </div>
      <ShortDivider dir="vertical" />
      <div className="py-16">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="mb-0 text-2xl font-medium">Latest Treat Magazines</h2>
          <p className="mb-8 text-[18px] font-regular">
            Browse the collection featuring all the 2022 Treat of The Month
            creators.
          </p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-16">
            {magazines.map((m) => (
              <MagazineCard key={m.href} {...m} />
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="w-full mb-12 text-center">
          <ShortDivider dir="vertical" />
          <div className="py-12">
            <h1 className="max-w-xl mx-auto mt-0 text-5xl font-medium">
              Get access to our past <br /> magazine publications
            </h1>
            <div className="flex justify-center w-full mt-8">
              <Link href={"https://opensea.io/collection/treatofthemonth"}>
                <a target="_blank" rel="noopener">
                  <Button>Visit the Ethereum collection.</Button>
                </a>
              </Link>
            </div>
          </div>
          <ShortDivider dir="vertical" />
        </div>
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const magazines = await prisma.magazine.findMany({
      orderBy: [
        {
          month_year: "desc",
        },
      ],
    });
    return {
      props: {
        magazines,
      },
    };
  } catch (err) {
    console.log({ err });
    return {
      props: {
        error: true,
        trace: JSON.stringify(err),
      },
    };
  }
};
