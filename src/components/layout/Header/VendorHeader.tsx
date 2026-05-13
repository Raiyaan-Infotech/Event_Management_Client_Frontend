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
  Mail,
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
import { useClientMailNotifications, useMarkClientNotificationsRead } from "@/hooks/use-client-mail";
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
  const { data: notifData } = useClientMailNotifications();
  const markRead = useMarkClientNotificationsRead();
  const unreadCount = notifData?.unread_count ?? 0;
  const notifications = notifData?.notifications ?? [];

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
            <Button variant="ghost" size="icon" className={`${ICON_BTN} p-0 data-[state=open]:bg-accent`}>
              <div className="relative">
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 bg-rose-500 rounded-full border border-background flex items-center justify-center text-[9px] font-black text-white leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0 border-border rounded-2xl shadow-xl mt-2 overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-sm text-foreground">
                Notifications {unreadCount > 0 && <span className="ml-1.5 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5 font-black">{unreadCount}</span>}
              </h3>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-primary hover:text-primary hover:bg-primary/5 font-bold"
                onClick={() => markRead.mutate()}>
                <CheckCheck className="size-3 mr-1" /> Mark all read
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">No notifications</div>
                ) : notifications.map((notif) => (
                  <Link key={notif.id} href="/support/notification"
                    className="flex gap-3 p-3 rounded-lg hover:bg-muted transition-all group relative">
                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                      <Mail className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[12px] font-bold text-foreground group-hover:text-primary transition-colors ${notif.is_read ? "opacity-70" : ""}`}>
                            New Mail
                          </span>
                          {!notif.is_read && (
                            <span className="size-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                          {notif.mail?.sent_at ? new Date(notif.mail.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className={`text-[11px] text-muted-foreground truncate ${notif.is_read ? "opacity-60" : ""}`}>
                        {notif.mail?.subject || 'No subject'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 text-center border-t border-border bg-card">
              <Link href="/support/notification">
                <Button variant="link" className="text-xs text-primary font-bold h-auto p-0">
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
