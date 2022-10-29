import { prisma } from "@db/engine";
import { SEOHead } from "@packages/seo/page";
import { Button } from "@packages/shared/components/Button";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import { Magazine } from "@prisma/client";
import Link from "next/link";


export default function MagazinePage({magazines, error, trace}: {magazines: Array<Magazine>, error: boolean, trace: any}) {
    const signUpForNewsletter = () => null;
    
    if(error) {
        return(
            <>
                <SEOHead title="An error occured" />
                <div className="py-8">
                    <h2 className="mb-1 text-xl font-medium text-gray-900">An error occurred loading the page</h2>
                <p className="">
                    {JSON.stringify(trace)}
                </p>
                </div>
            </>
        )
    }
    return(
        <>
            <div className="flex flex-col py-16 mt-16">
                <h1 className="mb-4 text-5xl font-medium xl:text-7xl text-slate-800">Treat Magazine</h1>
                <p>Receive a curated publication by Treat DAO featuring one creator each month, directly into your inbox</p>
                <div className="mt-4 cta">
                    <div className="flex flex-col gap-4">
                        <form className="flex gap-4" onSubmit={signUpForNewsletter}>
                            <input required className="px-4 py-2 border border-gray-300 shadow shadow-slate-500/10 rounded-xl" placeholder="Enter your email" />
                            <Button>
                                Send me updates
                            </Button>
                        </form>
                        <p>Or you can visit the <Link href={"/privacy"}>
                            <a className="font-medium underline">Ethereum collection.</a></Link></p>
                    </div>
                </div>
            </div>
            <div className="py-16">
                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2">
                    {magazines.map(m => (
                        <div className="relative h-auto col-span-1 transition-transform duration-200 ease-in-out border-white shadow-xl overflow-clip rounded-xl hover:scale-105 transition-scale hover:shadow-pink-500/30 shadow-pink-500/10" key={m.cover}>
                            <Link href={m.href}>
                                <a target={"_blank"} rel="noopener">
                                    <OptimizedImage src={m.cover} alt={m.title} layout="fill" />
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export const getStaticProps = async () => {
    try {
        const magazines = await prisma.magazine.findMany({
            orderBy: [{
                month_year: "desc"
            }]
        })
    return {
        props: {
            magazines
        }
    }
    } catch(err) {
        console.log({err})
        return {
            props: {
                error: true,
                trace: JSON.stringify(err)
            }
        }
    }
}