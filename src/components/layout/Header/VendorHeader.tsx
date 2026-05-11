"use client";

import * as React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import {
  Search,
  Maximize,
  Minimize,
  Moon,
  Sun,
  Bell,
  Clock,
  CheckCheck,
  MessageCircle,
  Mail,
  Users,
  User,
  Settings,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useClientMe, useClientLogout } from "@/hooks/use-client-auth";
import { resolveMediaUrl } from "@/lib/utils";

const ICON_BTN =
  "w-8 h-8 flex items-center justify-center rounded-full border border-border dark:border-white/10 bg-transparent text-muted-foreground hover:bg-accent dark:hover:bg-card/5 hover:text-primary dark:hover:text-white transition-all duration-200";

export default function VendorHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const { data: client } = useClientMe();
  const logout = useClientLogout();
  const vendor = client?.vendor;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  if (!mounted) {
    return (
      <header className="h-[56px] px-4 flex items-center bg-card border-b border-border sticky top-0 z-40">
        <SidebarTrigger className="w-8 h-8 border border-border bg-transparent" />
      </header>
    );
  }

  return (
    <header className="h-[56px] pl-3 pr-6 flex items-center justify-between bg-card dark:bg-[#09090b] backdrop-blur-md border-b border-border dark:border-[#27272a] sticky top-0 z-50 min-w-0 overflow-hidden text-foreground dark:text-gray-100">
      {/* Left */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <SidebarTrigger className="w-8 h-8 flex items-center justify-center rounded-sm border border-border dark:border-[#27272a] bg-transparent text-muted-foreground dark:text-gray-400 hover:bg-accent dark:hover:bg-[#27272a] hover:text-primary dark:hover:text-white hover:border-primary transition-all duration-200" />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-1.5 md:gap-2 shrink-0">
        {/* Search */}
        <Button variant="ghost" size="icon" className={ICON_BTN}>
          <Search className="size-4" />
        </Button>

        {/* Language */}
        <Button
          variant="ghost"
          size="icon"
          className={`${ICON_BTN} hidden sm:flex`}
        >
          <SafeImage
            src="/images/us.png"
            width={24}
            height={18}
            className="w-6 h-4 rounded-sm"
            alt="US"
          />
        </Button>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="icon"
          className={`${ICON_BTN} hidden sm:flex`}
          onClick={toggleFullscreen}
        >
          {fullscreen ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
        </Button>

        {/* Clock */}
        <Button
          variant="ghost"
          size="icon"
          className={`${ICON_BTN} hidden md:flex`}
        >
          <Clock className="size-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={ICON_BTN}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${ICON_BTN} p-0 data-[state=open]:bg-accent`}
            >
              <div className="relative">
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-rose-500 rounded-full border-2 border-background" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[320px] p-0 border-border rounded-2xl shadow-xl mt-2 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-sm text-foreground">
                Notifications
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-primary hover:text-primary hover:bg-primary/5 font-bold"
              >
                <CheckCheck className="size-3 mr-1" />
                Mark all read
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="p-2 space-y-1">
                {[
                  {
                    id: 1,
                    type: "mail",
                    title: "New Email",
                    from: "Adrian Monino",
                    text: "Someone who believes in you",
                    time: "11:30 AM",
                    href: "/support/mail",
                    isRead: false,
                  },
                  {
                    id: 2,
                    type: "mail",
                    title: "Weekly Update",
                    from: "Albert Ansing",
                    text: "Here's What You Missed This Week",
                    time: "06:50 AM",
                    href: "/support/mail",
                    isRead: false,
                  },
                  {
                    id: 3,
                    type: "mail",
                    title: "Search Tips",
                    from: "Carla Guden",
                    text: "4 Ways to Optimize Your Search",
                    time: "Yesterday",
                    href: "/support/mail",
                    isRead: true,
                  },
                ].map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    className="flex gap-3 p-3 rounded-lg hover:bg-muted transition-all group relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${
                        notif.type === "chat"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : notif.type === "mail"
                            ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                            : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {" "}
                        {notif.type === "chat" ? (
                          <MessageCircle className="size-3.5" />
                        ) : notif.type === "mail" ? (
                          <Mail className="size-3.5" />
                        ) : (
                          <Users className="size-3.5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[12px] font-bold text-foreground group-hover:text-primary transition-colors ${!notif.isRead ? "" : "opacity-70"}`}
                          >
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="size-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] text-muted-foreground truncate italic ${!notif.isRead ? "" : "opacity-60"}`}
                      >
                        <span className="font-bold text-foreground/80 not-italic">
                          {notif.from};
                        </span>{" "}
                        {notif.text}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 text-center border-t border-border bg-card">
              <Link href="/support/mail">
              <Button
                variant="link"
                className="text-xs text-primary font-bold h-auto p-0"
              >
                View All Notifications
              </Button>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group outline-none ml-1">
              <Avatar className="size-9 border border-border rounded-full group-hover:border-primary/30 transition-colors">
                <AvatarImage
                  src={resolveMediaUrl(client?.profile_pic) || undefined}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {client?.name?.charAt(0).toUpperCase() ?? "C"}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[240px] p-0 rounded-lg shadow-xl mt-2 border-border overflow-hidden "
          >
            {/* VALEX BLUE HEADER */}
            <div className="bg-primary p-5 text-center">
              <h6 className="font-bold text-[15px] text-white leading-tight uppercase tracking-wide">
                  {client?.name || "Client"}
              </h6>
              <span className="text-[11px] text-white/80 font-normal pt-1 block">
                Client Account
              </span>
            </div>

            <div className="p-1.5 bg-card">
              <DropdownMenuItem
                asChild
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none first:rounded-t-md"
              >
                <Link href="/settings">
                  <User
                    size={16}
                    className="mr-3 text-muted-foreground group-hover:text-primary"
                  />{" "}
                  Setting
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none"
              >
                <Link href="/profile">
                  <Settings
                    size={16}
                    className="mr-3 text-muted-foreground group-hover:text-primary"
                  />{" "}
                  Edit Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none"
              >
                <Link href="/support/mail">
                  <Mail
                    size={16}
                    className="mr-3 text-muted-foreground group-hover:text-primary"
                  />{" "}
                  Email
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none"
              >
                <Link href="/support/chat">
                  <MessageSquare
                    size={16}
                    className="mr-3 text-muted-foreground group-hover:text-primary"
                  />{" "}
                  Chat
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group rounded-b-md"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut
                  size={16}
                  className="mr-3 text-muted-foreground group-hover:text-primary"
                />
                {logout.isPending ? "Signing Out..." : "Sign Out"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
