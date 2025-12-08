import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  User,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLogoutHandler } from "@/hooks/useLogoutHandler";
import { useAppSelector } from "@/store/hooks";

export const StudentLayout = () => {
  const [open, setOpen] = useState(false);
  const { handleLogout, isLoggingOut } = useLogoutHandler();
  const user = useAppSelector((state) => state.auth.user);

  const showChat =
    user?.classification === "FRESHMAN" || user?.classification === "SOPHOMORE";

  const links = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: (
        <LayoutDashboard className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Courses",
      href: "/student/courses",
      icon: (
        <BookOpen className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Degree Plan",
      href: "/student/degree-plan",
      icon: (
        <GraduationCap className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    ...(showChat
      ? [
          {
            label: "Chat",
            href: "/student/chat",
            icon: (
              <MessageCircle className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
            ),
          },
        ]
      : []),
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-sidebar w-full flex-1 mx-auto overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: "Profile",
                href: "/student/profile",
                icon: (
                  <User className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
                ),
              }}
            />
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-2 px-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              disabled={isLoggingOut}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {open && (
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              )}
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 h-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="bg-background rounded-l-2xl shadow-lg border-l border-t border-b border-border p-4 md:p-6 lg:p-8 flex flex-col gap-4 h-full overflow-auto">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link
      to="/student/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <GraduationCap className="h-5 w-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-sidebar-foreground whitespace-pre">
        Student Portal
      </span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/student/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <GraduationCap className="h-5 w-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
