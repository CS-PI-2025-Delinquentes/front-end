import {
  Button,
  ButtonText,
  SectionApp,
  Shape,
  CloudinaryImage,
} from "@/components";
import {
  Package,
  UserCircle,
  Truck,
  Star,
  WhatsappLogo,
  ArrowSquareOut,
  EnvelopeSimple,
  Cube,
  List,
  FolderSimpleStar,
  ClipboardText,
  Gear,
  GearSix,
} from "phosphor-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import UserService from "../../../services/UserService";
import { Spinner } from "@/components/ui/spinner";

export function Home() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [userName, setUserName] = useState("");
  const [tipoConta, setTipoConta] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const toggleWhatsApp = () => setShowWhatsApp((prev) => !prev);
  const userService = new UserService();

  const serviceButtons = [
    {
      to: "/app/orcamento",
      className: "lg:order-1",
      buttonClass: "bg-red-tx",
      icon: <Package className="text-white icon" />,
      children: (
        <ButtonText className="text-white">Solicitar orçamento</ButtonText>
      ),
    },
    {
      to: "/app/minhas-solicitacoes",
      className: "lg:order-3",
      buttonClass: "bg-white border border-gray-600",
      icon: <ClipboardText className="text-red-tx icon" />,
      children: (
        <ButtonText className="text-black">Ver minhas solicitações</ButtonText>
      ),
    },
    {
      to: "/app/rotas-atendidas",
      className: "lg:order-5",
      buttonClass: "bg-white border border-gray-600",
      icon: <Truck className="text-red-tx icon" />,
      children: (
        <ButtonText className="text-black">Ver rotas atendidas</ButtonText>
      ),
    },
  ];

  const getDayPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "bom dia";
    if (hour >= 12 && hour < 18) return "boa tarde";
    return "boa noite";
  };

  const getInfo = async () => {
    try {
      
      const resposta = await userService.getInfo();
      console.log(resposta);
      if (resposta.status === 200) {
        setUserName(resposta.data.name || "Nome Generéico");
        setTipoConta(resposta.data.accountType || "Pessoa Física");
        sessionStorage.setItem("home", JSON.stringify([resposta.data.name, resposta.data.accountType, resposta.data.cpfCnpj, resposta.data.email, resposta.data.phone]));
      }
    } catch (error) {
      toast.error("Erro ao buscar dados");
      console.log(error);
      setUserName("Error");
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const reviewButtons = [
    {
      to: "/app/avaliar",
      className: "lg:order-4",
      buttonClass: "bg-white border border-gray-600",
      icon: <Star className="text-red-tx icon" />,
      children: (
        <ButtonText className="text-black">Avaliar nosso serviço</ButtonText>
      ),
    },
    {
      to: "/app/minhas-avaliacoes",
      className: "lg:order-6",
      buttonClass: "bg-white border border-gray-600",
      icon: <FolderSimpleStar className="text-red-tx icon" />,
      children: (
        <ButtonText className="text-black">Ver minhas avaliações</ButtonText>
      ),
    },
    {
      to: "/app/configuracoes",
      className: "lg:order-6",
      buttonClass: "bg-white border border-gray-600",
      icon: <GearSix className="text-red-tx icon" />,
      children: (
        <ButtonText className="text-black">Configurações</ButtonText>
      ),
    },
  ];

  if (isLoading) {
    return (
      <SectionApp>
        <div className="flex justify-center items-center h-screen">
          <Spinner className="text-blue-500" />
        </div>
      </SectionApp>
    );
  }

  return (
    <SectionApp>
      <div className="max-w-sm sm:max-w-lg lg:max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="items-center flex justify-center w-full">
            <CloudinaryImage
              publicId={"ndmrywtuuk65gxfo8onn"}
              className="w-48 sm:w-58 h-auto "
            />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-black pb-10 text-2xl sm:text-4xl font-heading">
              Olá, {getDayPeriod()} {userName}!
            </span>
          </div>
        </div>
        <div className="rounded-2xl px-3 py-2 sm:p-3 gap-x-2 flex items-center mb-5 shadow-sm drop-shadow-primary border-gray-50 xs:border-1 text-black ">
          <UserCircle size={48} />
          <div className="flex flex-col w-full">
            <span className="font-heading text-sm text-gray-600">{tipoConta}</span>
            <span className="font-heading text-xl">{userName}</span>
          </div>
          <Link to="/app/configuracoes">
            <GearSix size={32} className="hover:cursor-pointer" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-y-5 gap-x-5 lg:grid-cols-2">
          <Shape className="p-0 xs:p-4 sm:p-4 xl:p-6 xs:shadow-sm drop-shadow-primary border-gray-50 xs:border-1">
            <h4 className="lg:col-span mb-4">Frete</h4>
            <div className="grid grid-cols-1 gap-4 lg:gap-4">
              {serviceButtons.map((props, idx) => (
                <ServiceButtonLink key={idx} {...props} />
              ))}
            </div>
          </Shape>
          <Shape className="p-0 xs:p-4 sm:p-4 xl:p-6 xs:shadow-sm drop-shadow-primary border-gray-50 xs:border-1">
            <h4 className="lg:col-span mb-4">Outros</h4>
            <div className="grid grid-cols-1 gap-3 lg:gap-4">
              {reviewButtons.map((props, idx) => (
                <ServiceButtonLink key={idx} {...props} />
              ))}
            </div>
          </Shape>
        </div>
      </div>
      <div className="fixed right-2 bottom-2 sm:right-8 sm:bottom-8 space-y-2">
        {showWhatsApp && <WhatsAppNumbers toggle={toggleWhatsApp} />}
        <div className="flex gap-2 sm:gap-4 justify-end">
          <Button className="size-12 flex justify-around sm:size-16 sm:aspect-square bg-blue-500  ">
            <EnvelopeSimple size={36} className="text-white" />
          </Button>
          <Button className="size-12 flex justify-around sm:size-16 sm:aspect-square bg-success-base  " onClick={toggleWhatsApp}>
            <WhatsappLogo size={36} className="text-white" />
          </Button>
        </div>
      </div>
    </SectionApp>
  );
}

function WhatsAppNumbers({ toggle }) {
  return (
    <div className=" flex flex-col gap-y-2" >
      <Link to="https://wa.me/5544999965596" target="_blank" >
        <Button className="flex w-50  bg-success-base text-white" onClick={toggle}>
          <WhatsappLogo className="icon " />
          <ButtonText>WhatsApp 1</ButtonText>
        </Button>
      </Link>
      <Link to="https://wa.me/5544920001842" target="_blank" >
        <Button className="flex w-50  bg-success-base text-white" onClick={toggle}>
          <WhatsappLogo className="icon " />
          <ButtonText>WhatsApp 2</ButtonText>
        </Button>
      </Link>
    </div>
  );
}

function ServiceButtonLink({
  to,
  external = false,
  className = "",
  buttonClass = "",
  icon,
  children,
  arrowOut = false,
}) {
  const linkProps = external
    ? { to, target: "_blank", rel: "noopener noreferrer" }
    : { to };

  return (
    <Link {...linkProps} className={className}>
      <Button className={buttonClass}>
        {icon}
        {children}
        {arrowOut && <ArrowSquareOut className="text-gray-600 icon" />}
      </Button>
    </Link>
  );
}
