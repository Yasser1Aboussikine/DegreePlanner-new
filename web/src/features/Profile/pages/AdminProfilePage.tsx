import { useAppSelector } from "@/store/hooks";
import { PersonalInfoCard, AccountStatusCard } from "../components";
import { Shield } from "lucide-react";

export const AdminProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);

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
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Profile</h1>
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
