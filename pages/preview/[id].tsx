import { opendir } from "fs/promises";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function i(props: { media: Array<string>; error?: string }) {
  const [link, setLink] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { filename } = router.query;
    setLink("http://localhost/api/media/" + filename);
  }, [router]);

  console.log({ link });

  return (
    <div className="grid w-full max-w-6xl grid-cols-4 gap-12 py-12 mx-auto">
      <div className="col-span-3">
        <div className="w-full h-[80vh] my-auto bg-slate-900">
          {
            // <video src={`blob:${link}`} className="w-full h-full" />
          }
        </div>
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-1 gap-4">
          {props.media.map((i) => (
            <Link href={"/preview/" + i} key={i}>
              <a>
                <div className="w-full">
                  <h5 className="font-bold">Media</h5>
                  <p>http://localhost:3000/preview/</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const dir = await opendir("/Users/munychitz/misx");
    const media = [];
    for await (const dirent of dir) media.push(dirent.name);
    return {
      props: {
        media,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        media: [],
        err: JSON.stringify(err),
      },
    };
  }
};
