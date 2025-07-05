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
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

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
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  }
];

export function AppSidebar() {
  const { data: loggedInUser, isLoading: isAuthLoading } = useUser()
  const navigate = useNavigate()
  const logout = useLogout();
  const location = useLocation();

  const isActive = (url: string) => location.pathname === url;

  if (isAuthLoading) return <div>Loading...</div>
  if (!loggedInUser) {
    navigate('/login')
  }

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
                          <a
                              href={item.url}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                  isActive(item.url)
                                      ? "bg-[#0E6654]/10 text-[#0E6654] font-semibold"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          <div className="p-4 space-y-3">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-[#0E6654] text-white text-sm font-bold rounded-full">
              {loggedInUser?.name?.charAt(0)?.toUpperCase()}
            </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{loggedInUser?.name}</p>
                <p className="text-xs text-gray-500 truncate">{loggedInUser?.roles}</p>
              </div>
            </div>

            {/* Logout Button */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
  );
}