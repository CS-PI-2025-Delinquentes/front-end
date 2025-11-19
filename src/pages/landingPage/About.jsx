import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, Section, Shape } from "@/components";
import { CarouselPlugin } from "./Carousel";

export function About () {
    return (
        <>  
            <div id="about" className="bg-red-tx ">
               <Section className="w-full px-4 lg:px-10 flex flex-col lg:flex-row items-start gap-10 py-10">

                    {/* Carousel com overflow-hidden */}
                    <div className="w-full lg:w-[65%] overflow-hidden">
                    <CarouselPlugin />
                    </div>

                    {/* Texto */}
                    <div className="w-full lg:w-[35%] text-white">
                    <h2 className="text-2xl font-bold mb-3">Sobre</h2>
                    <p className="text-sm leading-relaxed">
                        A Teruel Express é uma empresa especializada em serviços de entregas que atua em grande parte da região Noroeste do Paraná.
                        Nosso propósito é oferecer soluções logísticas com rapidez, qualidade e segurança, sempre alinhando excelência no atendimento com os melhores preços do mercado.
                        Com uma equipe dedicada e foco em resultados, buscamos atender às necessidades de nossos clientes com eficiência, garantindo agilidade e confiança em cada entrega.
                    </p>
                    </div>

                </Section>

            </div>
        </>
            
    )
}

