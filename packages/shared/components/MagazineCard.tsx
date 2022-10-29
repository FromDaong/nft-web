import { Magazine } from "@prisma/client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ColorExtractor } from 'react-color-extractor'
import OptimizedImage from "./OptimizedImage";

export default function MagazineCard(mag: Magazine) {
    const [colorMap, setColorMap] = useState([]);
    const [linear_gradient, setLinearBackground] = useState("")
    
    const  hexToRgb = (hex: string) => {
        console.log(hex)
        const bigint = parseInt(hex.slice(1, hex.length), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return r + " " + g + " " + b;
    }

    const updateColors = (colors: string[]) => {
        setColorMap(colors);
    }

    useEffect(() => {
        if(colorMap.length > 0) {
            setLinearBackground(`linear-gradient(0deg, rgb(${hexToRgb(colorMap[0])}/95) 0%, rgb(${hexToRgb(colorMap[1])} / 95%) 35%, rgb(${hexToRgb(colorMap[1])} / 63%) 50%, rgb(${hexToRgb(colorMap[1])} / 11%) 78%, rgb(0 0 0 / 91%) 100%)`)
        }
    }, [colorMap])

    return(
        <>
            <ColorExtractor getColors={updateColors}>
                    <img className="sr-only" src={mag.cover} />
              </ColorExtractor>
              <div
                  className="h-auto relative col-span-3 h-[480px] border shadow-xl overflow-clip rounded-xl md:col-span-2 lg:col-span-1"
                  key={mag.cover}
                >
                  <Link href={mag.href}>
                    <a target={"_blank"} rel="noopener">
                      <div className="relative w-full h-full">
                        <div className="h-full">
                          <OptimizedImage
                            src={mag.cover}
                            alt={mag.title}
                            layout="fill"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 z-10" style={{background: '#0b0c0f80'}}/>
                      <div style={{
                        background: `linear-gradient(0deg, ${colorMap[0]}, transparent)`,
                        
                      }} className="absolute bottom-0 left-0 z-20 flex w-full h-full hue-rotate-15">
                        <div className="absolute inset-0 w-full h-8" style={{background: 'linear-gradient(0deg, transparent, #222222)'}}/>
                        <div className="flex flex-col justify-end w-full">
                          <div className="px-4 py-1">
                            <h3 className="mb-1 text-2xl font-bold text-white">
                              {mag.title}
                            </h3>
                          </div>
                          <div style={{
                            background: "#00000020"
                          }} className={`flex justify-between w-full p-4`}>
                            <div className="p-2 border rounded-full bg-gray-900/20">
                              <ArrowRightIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="relative w-8 h-8">
                              <OptimizedImage
                                alt="Issuu Logo"
                                src="/assets/issuu-logo.png"
                                layout="fill"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
        </>
    )
}