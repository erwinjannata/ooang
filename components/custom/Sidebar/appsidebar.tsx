"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { navGroups } from "@/lib/constants/navItems";
import { UserProfile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import {
  ChevronRight,
  ChevronUp,
  CircleUser,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { logout } from "./actions";

type SidebarProps = {
  user: User;
  profile: UserProfile;
};

export function AppSidebar({ profile }: SidebarProps) {
  const id = useId();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="py-2 px-auto">
            <Link href="/">
              <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                OOang
              </h1>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.content.map((content) => (
                  <Collapsible
                    className="group/collapsible"
                    key={content.title}
                  >
                    <SidebarMenuItem className="space-y-2">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton
                          className="flex justify-between items-center px-2 py-4"
                          id={id}
                        >
                          <div className="flex flex-row items-center gap-4">
                            <content.icon className="w-4 h-4" />
                            <span className="font-medium">{content.title}</span>
                          </div>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuSubButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent id={id}>
                        <SidebarMenuSub>
                          {content.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={item.url}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="flex justify-between items-center px-2 py-4 w-full h-auto"
                  id={id}
                >
                  <CircleUserRound className="w-4 h-4" />
                  <p className="text-sm leading-none font-medium">
                    {profile.display_name}
                  </p>
                  <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-60" id={id}>
                <DropdownMenuItem>
                  <CircleUser /> <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} variant="destructive">
                  <LogOut /> <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
