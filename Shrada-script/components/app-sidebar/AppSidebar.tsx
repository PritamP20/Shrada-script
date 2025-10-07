import { 
  Calendar, Home, Inbox, Search, Settings, User, HelpCircle, LogOut, 
  ChevronRight, Palette, Bell, Shield, Database, Sun, Moon 
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

// ---------- Menu Data ----------
const mainItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

const calendarMonths = Array.from({ length: 12 }).map((_, i) => ({
  title: new Date(0, i).toLocaleString("default", { month: "long" }),
  url: "#",
  icon: Calendar,
}));

const userItems = [
  { title: "Profile", url: "#", icon: User },
  { title: "Help", url: "#", icon: HelpCircle },
];

const settingsItems = [
  { title: "Appearance", url: "#", icon: Palette },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Privacy", url: "#", icon: Shield },
  { title: "Data & Storage", url: "#", icon: Database },
];

// ---------- Sidebar Component ----------
export function AppSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Sidebar collapsible="icon" className="flex flex-col justify-between">
      {/* Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shardha Script</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Home & Inbox */}
              {mainItems.slice(0, 2).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Calendar with Submenu */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Calendar />
                  <span>Calendar</span>
                </SidebarMenuButton>
                <SidebarMenuSub className="max-h-[30vh] overflow-y-auto">
                  {calendarMonths.map((month) => (
                    <SidebarMenuSubItem key={month.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={month.url}>
                          <span>{month.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Search */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Search />
                    <span>Search</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings with toggle */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSettingsOpen(!settingsOpen)}>
                  <Settings />
                  <span>Settings</span>
                  <ChevronRight className={`ml-auto transition-transform ${settingsOpen ? "rotate-90" : ""}`} />
                </SidebarMenuButton>
                {settingsOpen && (
                  <SidebarMenuSub>
                    {settingsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url} className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User & Theme */}
      <SidebarFooter>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Theme toggle */}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={toggleTheme} className="flex items-center gap-2">
                {theme === "dark" ? <Sun /> : <Moon />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* User items */}
            {userItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Logout */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-2">
                  <LogOut />
                  <span>Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
