import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  User,
  LayoutDashboard,
  BookOpen,
  UserCheck,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogoutHandler } from "@/hooks/useLogoutHandler";

export const RegistrarLayout = () => {
  const [open, setOpen] = useState(false);
  const { handleLogout, isLoggingOut } = useLogoutHandler();

  const links = [
    {
      label: "Dashboard",
      href: "/registrar/dashboard",
      icon: (
        <LayoutDashboard className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Courses",
      href: "/registrar/courses",
      icon: (
        <BookOpen className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Assign",
      href: "/registrar/assign",
      icon: (
        <UserCheck className="text-sidebar-foreground group-hover/sidebar:text-sidebar-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
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
                href: "/registrar/profile",
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
                <span>
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              )}
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 h-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="bg-background rounded-l-2xl shadow-lg border-l border-t border-b border-border p-4 md:p-6 lg:p-8 flex flex-col gap-4 h-full overflow-auto">
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
      to="/registrar/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <ClipboardList className="h-5 w-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-sidebar-foreground whitespace-pre">
        Registrar Portal
      </span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/registrar/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <ClipboardList className="h-5 w-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
