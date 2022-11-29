import { prisma } from "@db/engine";
import { SEOHead } from "@packages/seo/page";
import { Button } from "@packages/shared/components/Button";
import { ShortDivider } from "@packages/shared/components/Divider";
import { Divider } from "@packages/shared/components/Divider";
import MagazineCard from "@packages/shared/components/MagazineCard";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import { Magazine } from "@prisma/client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CollectiblePage({
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
      <div className="max-w-xl py-16 mx-auto">
        <div className="relative w-full border shadow-xl overflow-clip rounded-xl ">
            <div>
                <img
                    src="https://f8n-production-collection-assets.imgix.net/0xc5aDEAE1C1b7C85649B09C6932D651763Ce09D31/pre_reveal/nft.gif?q=80&auto=compress&cs=srgb&w=3000&h=3000"
                    alt="Collectible"
                />
            </div>
        </div>
      </div>

    <div className="w-full py-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-16">
            <div className="m-8">
            <h1 style={{fontWeight:800,fontSize: 32}}>Zibaldone #21</h1>
                <p style={{fontWeight:800,fontSize: 14,}}>Minted on Nov 25, 2022</p>
                <div className="flex row items-center mt-4">
                    <div className="">   
                        <p style={{fontWeight:800,fontSize: 16,}}>Created By</p> 
                        <span className="flex row items-center px-4 py-1 font-medium bg-gray-100 border border-gray-200 rounded-full hover:bg-white">
                            <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                /> @Codeslayer
                        </span>
                    </div>
                    <div className="ml-4">
                    <ShortDivider dir="horizontal" />
                    </div>
                    <div className="ml-4">
                        <p style={{fontWeight:800,fontSize: 16,}}>Collection</p> 
                        <span className="flex row items-center px-4 py-1 font-medium bg-gray-100 border border-gray-200 rounded-full hover:bg-white">
                            <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                />Zibaldone
                        </span>
                    </div>
                </div>
            </div>

            <div className="m-8">
                <div className="flex items-center flex-col w-full  border border-gray-200 rounded-3xl grid grid-cols-2 ">
                   <div style={{padding:"20px"}}>
                        <p style={{fontWeight:800,fontSize: 14,}}>Last Sold</p>
                        <p style={{fontWeight:800,fontSize: 20,}}>0.14ETH</p>
                   </div>
                   <div className="flex justify-end" style={{padding:"20px"}}>
                        <ConnectButton
                            label="Make Offer"
                            chainStatus="icon"
                            showBalance={false}
                            />
                   </div>
                </div>
                <div className="flex row items-center justify-center gap-4 m-4">
                    <p style={{fontWeight:800,fontSize: 16,}}>Owned by</p>
                    <span className="flex row items-center px-4 py-1 font-medium bg-gray-100 border border-gray-200 rounded-full hover:bg-white">
                        <img
                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                            alt="TOTM Profile Picture"
                            /> @Codeslayer
                    </span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-16">
            <div className="m-8">
                <h1 style={{fontWeight:800,fontSize: 26,}}>Details</h1>
                <Divider dir="vertical" />
                <p style={{fontWeight:800,fontSize: 18, color:"#b2b2b2", marginTop:"30px"}}>View on Etherscan</p>
                <p style={{fontWeight:800,fontSize: 18, color:"#b2b2b2", marginTop:"15px"}}>View metadata</p>

               <div className="mt-8">
                    <span className=" px-8 py-4 font-medium bg-gray-100 border border-gray-200 rounded-full hover:bg-white">
                        Share
                    </span>
               </div>
            </div>
            <div className="m-8">
                <h1 style={{fontWeight:800,fontSize: 26,}}>Provenance</h1>
                <Divider dir="vertical"/>
                <div className="flex row items-center justify-center gap-4 m-4">
                    <div className="mt-16">
                        <div className="flex row items-center justify-center">
                            <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-20 h-20 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                />
                        </div>
                        <div className="flex row items-center justify-center gap-4">
                            <p style={{fontWeight:800,fontSize: 18,}}>Bought by <span>@codeslayer</span></p>
                        </div>
                        <div className="flex row items-center justify-center gap-4">
                            <p style={{fontWeight:800,fontSize: 22,}}>Sold for 0.214ETH</p>
                        </div>
                        <div className="flex row items-center justify-center gap-4">
                            <p style={{fontWeight:500,fontSize: 14,}}>Nov 24 2022</p>
                        </div>
                        
                    </div>
                </div>

                <div className="flex items-center flex-col w-full py-4  border-y border-gray-200  grid grid-cols-2 ">
                   <div className="flex items-center">
                        <img
                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                            alt="TOTM Profile Picture"
                            />
                           <div className="ml-2">
                                <p style={{fontWeight:800,fontSize: 18,}}>Buy Now price set by <span>0xeB59…FE93</span></p>
                                <p style={{fontWeight:500,fontSize: 14,}}>Nov 26, 2022 at 1:15pm</p>
                           </div>
                   </div>
                   <div className="flex justify-end">
                        <p style={{fontWeight:800,fontSize: 20,}}>0.241ETH</p>
                   </div>
                </div>
                <div className="flex items-center flex-col w-full py-4  border-y border-gray-200  grid grid-cols-2 ">
                   <div className="flex items-center">
                        <img
                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                            alt="TOTM Profile Picture"
                            />
                           <div className="ml-2">
                                <p style={{fontWeight:800,fontSize: 18,}}>Minted by <span>0xeB59…FE93</span></p>
                                <p style={{fontWeight:500,fontSize: 14,}}>Nov 26, 2022 at 1:15pm</p>
                           </div>
                   </div>
                   <div className="flex justify-end">
                        <p style={{fontWeight:800,fontSize: 20,}}>0.241ETH</p>
                   </div>
                </div>
               
            </div>
        </div>
    </div>
    <h1 style={{fontWeight:800,fontSize: 32}}>More from this collection</h1>
    <div className="w-full py-16  px-16 bg-[url('/assets/collectibles/bg.jpg')]" >   
        <div className="grid grid-cols-4 gap-x-8 gap-y-16">
            <div className="col-span-1">
               <div style={{
                    backgroundColor:"#0000001c",
                    width:100,
                    height:100,
                    borderRadius: 10,
                    padding:10
               }}>
                    <img
                            src="https://api.time.com/wp-content/uploads/2021/03/nft-art-1.jpg"
                            alt="Collectible"
                            style={{
                                borderRadius:10
                            }}
                        />
               </div>
               <div style={{
                    backgroundColor:"#0000003c",
                    borderRadius: 30,
                    padding:10,
                    width:100,
                    marginTop:100
               }}>
                 <div className="flex row items-center justify-center gap-4">
                    <p style={{fontWeight:800,fontSize: 14, color:"#ffffff"}}>ZIBA</p>
                 </div>
                </div>
                <div className="flex row items-center  gap-4">
                    <p style={{fontWeight:800,fontSize: 24, color:"#ffffff"}}>Zibaldone</p>
                </div>
                <div className="flex row items-center  gap-4">
                    <p style={{fontWeight:800,fontSize: 14, color:"#ffffff"}}>200 NFTs</p>
                </div>
                <div className="flex row items-center gap-4">
                    <div style={{
                        backgroundColor:"#ffffff3c",
                        borderRadius: 30,
                        padding:10,
                        width:200,
                        marginTop:100
                    }}>
                        <div className="flex row items-center  gap-4">
                            <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                /> @Codeslayer
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <div className="grid grid-cols-3 gap-x-8 gap-y-16">
                    <div style={{
                            padding:"10px",
                            borderRadius:"10px",
                            border:"solid 1px #c4c4c4",
                            boxShadow:"1px 1px 1px #c4c4c4",
                            backgroundColor:"#ffffff"
                        }}>
                        <img
                            src="https://f8n-production-collection-assets.imgix.net/0xc5aDEAE1C1b7C85649B09C6932D651763Ce09D31/pre_reveal/nft.gif?q=80&auto=compress&cs=srgb&w=3000&h=3000"
                            alt="Collectible"
                            style={{
                                borderRadius:"10px",
                            }}
                        />
                        <div>
                            <div className="flex items-center">
                                <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                /><p style={{fontWeight:800,fontSize: 18, marginLeft:"10px"}}><span>@Codeslayer</span></p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-16">
                                <div className="mt-4">
                                    <p style={{fontWeight:800,fontSize: 14,}}>Last Sold</p>
                                    <p style={{fontWeight:800,fontSize: 20,}}>0.14ETH</p>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <img
                                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                            alt="TOTM Profile Picture"
                                            /><p style={{fontWeight:500,fontSize: 18, marginLeft:"10px"}}><span>0xeB59…FE93</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                            padding:"10px",
                            border:"solid 1px #c4c4c4",
                            borderRadius:"10px",
                            boxShadow:"1px 1px 1px #c4c4c4",
                            backgroundColor:"#ffffff"
                        }}>
                        <img
                            src="https://f8n-production-collection-assets.imgix.net/0xc5aDEAE1C1b7C85649B09C6932D651763Ce09D31/pre_reveal/nft.gif?q=80&auto=compress&cs=srgb&w=3000&h=3000"
                            alt="Collectible"
                            style={{
                                borderRadius:"10px",
                            }}
                        />
                        <div>
                            <div className="flex items-center">
                                <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                /><p style={{fontWeight:800,fontSize: 18, marginLeft:"10px"}}><span>@Codeslayer</span></p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-16">
                                <div className="mt-4">
                                    <p style={{fontWeight:800,fontSize: 14,}}>Last Sold</p>
                                    <p style={{fontWeight:800,fontSize: 20,}}>0.14ETH</p>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <img
                                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                            alt="TOTM Profile Picture"
                                            /><p style={{fontWeight:500,fontSize: 18, marginLeft:"10px"}}><span>0xeB59…FE93</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                            padding:"10px",
                            borderRadius:"10px",
                            border:"solid 1px #c4c4c4",
                            boxShadow:"1px 1px 1px #c4c4c4",
                            backgroundColor:"#ffffff",
                        }}>
                        <img
                            src="https://f8n-production-collection-assets.imgix.net/0xc5aDEAE1C1b7C85649B09C6932D651763Ce09D31/pre_reveal/nft.gif?q=80&auto=compress&cs=srgb&w=3000&h=3000"
                            alt="Collectible"
                            style={{
                                borderRadius:"10px",
                            }}
                        />
                        <div>
                            <div className="flex items-center">
                                <img
                                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                alt="TOTM Profile Picture"
                                /><p style={{fontWeight:800,fontSize: 18, marginLeft:"10px"}}><span>@Codeslayer</span></p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-16">
                                <div className="mt-4">
                                    <p style={{fontWeight:800,fontSize: 14,}}>Last Sold</p>
                                    <p style={{fontWeight:800,fontSize: 20,}}>0.14ETH</p>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <img
                                            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                                            className="object-cover w-10 h-10 border-4 border-white rounded-full shadow-xl"
                                            alt="TOTM Profile Picture"
                                            /><p style={{fontWeight:500,fontSize: 18, marginLeft:"10px"}}><span>0xeB59…FE93</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   
            </div>
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
