import { House, Package, Truck, Cube, Star, FolderSimpleStar, ClipboardText, GearSix, SignOut } from "phosphor-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

// Menu items.
const items = [
  { title: "Página inicial", url: "/app/home", icon: House },
  { title: "Solicitar orçamento", url: "/app/orcamento", icon: Package },
  { title: "Minhas solicitações", url: "/app/minhas-solicitacoes", icon: ClipboardText },
  { title: "Rotas atendidas", url: "/app/rotas-atendidas", icon: Truck },
  { title: "Avalie nosso serviço", url: "/app/avaliar", icon: Star },
  { title: "Minhas avaliações", url: "/app/minhas-avaliacoes", icon: FolderSimpleStar },
  { title: "Configurações", url: "/app/configuracoes", icon: GearSix },
];

export function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  function handleSidebarToggle() {
    if (isMobile) toggleSidebar();
  }

  function handleLogout() {
    Cookies.remove('token', { path: '/' });
    navigate('/');
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teruel Express</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} onClick={handleSidebarToggle}>
                    <SidebarMenuButton asChild className="h-10">
                      <Link to={item.url}>
                        <item.icon
                          className="size-10"
                          weight={isActive ? "fill" : "regular"}
                        />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Logout button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="h-10 text-red-600 hover:bg-red-100 flex items-center gap-2"
                >
                  <SignOut size={20} />
                  <span className="text-base">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
