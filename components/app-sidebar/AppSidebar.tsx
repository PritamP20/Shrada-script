import { Calendar, Home, Inbox, Search, Settings, User, HelpCircle, LogOut, ChevronRight, Palette, Bell, Shield, Database, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"

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
} from "@/components/ui/sidebar"

// Main menu items.
const mainItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

// Calendar months
const calendarMonths = [
  {
    title: "January",
    url: "#",
    icon: Calendar,
  },
  {
    title: "February",
    url: "#",
    icon: Calendar,
  },
  {
    title: "March",
    url: "#",
    icon: Calendar,
  },
  {
    title: "April",
    url: "#",
    icon: Calendar,
  },
  {
    title: "May",
    url: "#",
    icon: Calendar,
  },
  {
    title: "June",
    url: "#",
    icon: Calendar,
  },
  {
    title: "July",
    url: "#",
    icon: Calendar,
  },
  {
    title: "August",
    url: "#",
    icon: Calendar,
  },
  {
    title: "September",
    url: "#",
    icon: Calendar,
  },
  {
    title: "October",
    url: "#",
    icon: Calendar,
  },
  {
    title: "November",
    url: "#",
    icon: Calendar,
  },
  {
    title: "December",
    url: "#",
    icon: Calendar,
  },
]

// User menu items.
const userItems = [
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
  {
    title: "Help",
    url: "#",
    icon: HelpCircle,
  },
]

// Settings subcategories
const settingsItems = [
  {
    title: "Appearance",
    url: "#",
    icon: Palette,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Privacy",
    url: "#",
    icon: Shield,
  },
  {
    title: "Data & Storage",
    url: "#",
    icon: Database,
  },
]

export function AppSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shardha Script</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.slice(0, 2).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Calendar with always-visible submenu */}
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

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSettingsOpen(!settingsOpen)}>
                  <Settings />
                  <span>Settings</span>
                  <ChevronRight className={`ml-auto sidebar-chevron ${settingsOpen ? 'rotate-90' : ''}`} />
                </SidebarMenuButton>
                {settingsOpen && (
                  <SidebarMenuSub>
                    {settingsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>
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
      <SidebarFooter>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun /> : <Moon />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            <SidebarMenu>
              {userItems.map((item) => (
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
        </SidebarFooter>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <LogOut />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}