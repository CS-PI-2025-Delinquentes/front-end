import { Section } from "@/components";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star, UserCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import ReviewService from "@/services/ReviewService";

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const reviewService = new ReviewService();

  useEffect(() => {

    reviewService.findAllLanding()
      .then(response => {
        const data = response.data.content || [];
        const formatted = data.map(r => ({
          nome: r.nomeAvaliador,
          estrelas: r.nota,
          comentario: r.descricao
        }));
        setReviews(formatted);
      })
      .catch(() => setReviews([]));
  }, []);

  return (
    <>
      <div className="bg-blue-tx">
        <Section id="reviews">
          <h2 className="text-white pb-6">Avaliações</h2>
          <CarouselSize data={reviews} />
        </Section>
      </div>
    </>
  )
}

export function CarouselSize({ data }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {data.map((review, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col justify-start min-h-[220px] p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                      <UserCircle className="icon w-16 h-16 text-gray-100 " />
                      <div className="flex flex-col">
                        <p className="font-bold">{review.nome}</p>
                        <div className="flex flex-row">
                          {Array.from({ length: review.estrelas }).map((_, index) => (
                            <StarFull key={index} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>{review.comentario}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="bg-white hidden md:block">
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </div>
    </Carousel>
  )
}

function StarFull() {
  return (
    <div className="relative w-6 h-7">
      <Star className="absolute inset-0 text-star w-6 h-6" weight="fill" />
      <Star className="absolute inset-0 text-star-border w-6 h-6" weight="regular" />
    </div>
  )
}

