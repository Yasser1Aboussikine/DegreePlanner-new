import { useAppSelector } from "@/store/hooks";
import { PersonalInfoCard, AccountStatusCard } from "../components";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export const AdvisorProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { theme, setTheme } = useTheme();

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Advisor Profile</h1>
        </div>

        <div className="flex items-center gap-3">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoCard
          name={user.name ?? undefined}
          email={user.email}
          role={user.role}
          joinDate={user.joinDate ? user.joinDate.toString() : undefined}
          emailVerified={!!user.emailVerifiedAt}
        />

        <AccountStatusCard
          isActive={user.isActive}
          createdAt={user.createdAt?.toString() ?? new Date().toString()}
          updatedAt={user.updatedAt?.toString() ?? new Date().toString()}
        />
      </div>
    </div>
  );
};
