import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, Section, Shape } from "@/components";
import { useState } from "react";
import { List, Package, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { CloudinaryImage } from "@/components/CloudinaryImage.jsx";

export function Header() {
    const [menu, setMenu] = useState(false);

    function Menu() {
        return (
            <>
                <div className="w-6/10 h-auto bg-white fixed top-5 right-0 rounded-bl-2xl justify-self-end pr-5 pl-5 z-3 lg:hidden gap-0">
                    <X className="icon mb-4 hover:cursor-pointer" onClick={() => { setMenu(false) }} />
                    <div className="flex flex-col my-5" onClick={() => { setMenu(false) }}>
                        <a className="font-bold hover:cursor-pointer" href="#budget">
                            <p>Simular orçamento</p>
                        </a>
                        <a className="font-bold hover:cursor-pointer" href="#routes">
                            <p>Rotas atendidas</p>
                        </a>
                        <a className="font-bold hover:cursor-pointer" href="#footer">
                            <p>Contato</p>
                        </a>
                        <a className="font-bold hover:cursor-pointer" href="#reviews">
                            <p>Avaliações</p>
                        </a>
                        <a className="font-bold hover:cursor-pointer" href="#about">
                            <p>Sobre</p>
                        </a>
                        <a className="font-bold hover:cursor-pointer" href="#clients">
                            <p>Nossos clientes</p>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-3 mb-5">
                        <Link to="/login">
                            <Button className="bg-white border-1 border-gray-600 px-0 h-8 rounded-lg">
                                <ButtonText className="text-black text-xs text-center">
                                    Entrar
                                </ButtonText>
                            </Button>
                        </Link>
                        <Link to="/cadastro">
                            <Button className="bg-red-tx px-0 h-8 rounded-lg">
                                <ButtonText className="text-white text-xs text-center">
                                    Criar conta
                                </ButtonText>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="fixed bg-black h-lvh w-lvw z-2 opacity-80 lg:hidden" onClick={() => { setMenu(false) }}></div>
            </>
        )
    }
    return (
        <>
            <header className="shadow px-6 py-2 sm:px-4 md:px-10 mx-auto max-w-495 sticky top-0 bg-white z-1 flex justify-between items-center">
                <CloudinaryImage publicId={"ndmrywtuuk65gxfo8onn"} className="w-26 h-auto"/>
                <NavBar> </NavBar>
                <List className="icon self-center hover:cursor-pointer lg:hidden" onClick={() => { setMenu(true) }} />
            </header>
            {menu && <Menu></Menu>}
        </>
    )
}

function NavBar() {
    return (
        <div className="hidden lg:contents">
           <a className="hover:cursor-pointer" href="#budget">
                <p>Orçamento</p>
            </a>
            <a className="hover:cursor-pointer" href="#routes">
                <p>Rotas</p>
            </a>
            <a className="hover:cursor-pointer" href="#footer">
                <p>Contato</p>
            </a>
            <a className="hover:cursor-pointer" href="#reviews">
                <p>Avaliações</p>
            </a>
            <a className="hover:cursor-pointer" href="#about">
                <p>Sobre</p>
            </a>
            <a className="hover:cursor-pointer" href="#clients">
                <p>Clientes</p>
            </a>
            <div className="text-end">
                <Link to="/login">
                    <Button className="bg-red-tx px-4 h-10 sm:h-12 rounded-lg">
                        <ButtonText className="text-white text-xs text-center">
                            Entrar
                        </ButtonText>
                    </Button>
                </Link>
            </div>
        </div>
    )
}