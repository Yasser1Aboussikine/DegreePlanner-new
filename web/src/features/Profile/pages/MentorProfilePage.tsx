import { useAppSelector } from "@/store/hooks";
import {
  PersonalInfoCard,
  AcademicInfoCard,
  AccountStatusCard,
  MyStudentsCard,
} from "../components";
import { Users } from "lucide-react";

export const MentorProfilePage = () => {
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
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mentor Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoCard
          name={user.name ?? undefined}
          email={user.email}
          role={user.role}
          joinDate={user.joinDate ? user.joinDate.toString() : undefined}
          emailVerified={!!user.emailVerifiedAt}
        />

        <AcademicInfoCard
          major={user.major ?? undefined}
          minor={user.minor ?? undefined}
          classification={user.classification ?? undefined}
          expectedGraduation={
            user.expectedGraduation
              ? user.expectedGraduation.toString()
              : undefined
          }
          isFYEStudent={user.isFYEStudent}
        />

        <MyStudentsCard mentorId={user.id} />

        <AccountStatusCard
          isActive={user.isActive}
          createdAt={user.createdAt?.toString() ?? new Date().toString()}
          updatedAt={user.updatedAt?.toString() ?? new Date().toString()}
        />
      </div>
    </div>
  );
};
