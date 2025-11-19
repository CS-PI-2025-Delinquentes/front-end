import React from "react";
import { ArrowLeft, List } from "phosphor-react";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar"

export function AppHeader({ screenTitle }: { screenTitle: string }) {
  return (
    <div className="xl:col-span-2 flex items-center">
      <Link to="/app/home">
        <ArrowLeft className="text-black size-8 icon" />
      </Link>
      <h3 className="text-center flex-auto">{screenTitle}</h3>
     <CustomTrigger/>
    </div>
  );
}

function CustomTrigger() {
  const { toggleSidebar } = useSidebar()
  return <List onClick={toggleSidebar} className="icon md:hidden"/>
}
