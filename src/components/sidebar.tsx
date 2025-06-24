import { Calendar, LogOut, User, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useAuthMutations";

const mainItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Fixtures",
    url: "/fixtures",
    icon: Calendar,
  },
];

const profileItem = {
  title: "Profile",
  url: "/profile",
  icon: User,
};

export function AppSidebar() {
  const logout = useLogout();
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Fanatix Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-4">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={()=> logout()}>
               <LogOut /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={profileItem.url}>
                  <profileItem.icon />
                  <span>{profileItem.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
