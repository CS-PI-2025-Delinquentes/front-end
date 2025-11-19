import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { CloudinaryImage } from "@/components/CloudinaryImage.jsx";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  const aboutImages = [
    "cyk5nblx6kpjeur7lb2e",
    "sqeb495pdgoxsc8qhs6m",
    "c96wgidmghy51b2rtf0q",
    "g0x03qt4zhzdksukcnis",
    "bmywuppdmjd9f4r7lhw9",
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className=" w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {aboutImages.map((src, index) => (
          <CarouselItem key={index} className="p-2 m-0">
            <div className="w-full xs:h-[450px] flex items-center justify-center bg-transparent rounded-2xl overflow-hidden">
              <CloudinaryImage
                key={src}
                publicId={src}
                border="20"
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious
          className="
            left-3 
            bg-black/40 hover:bg-black/60 
            text-white
            rounded-full 
            p-2
            shadow-lg
            border border-white/20
            cursor-pointer
          "
        />
        <CarouselNext
          className="
            right-3 
            bg-black/40 hover:bg-black/60 
            text-white
            rounded-full 
            p-2
            shadow-lg
            border border-white/20
            cursor-pointer
          "
        />
      </div>
    </Carousel>
  )
}
