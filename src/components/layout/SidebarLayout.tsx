import { Outlet } from "react-router-dom";
import { AppSidebar } from "../sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { useAuthInit } from "@/hooks/useAuthInit";



const SidebarLayout = () => {
  useAuthInit();
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className=" w-full">
          <SidebarTrigger className="block md:hidden mb-4" />
          <Outlet />
        </main>
      </SidebarProvider>
    );
  }

  export default SidebarLayout