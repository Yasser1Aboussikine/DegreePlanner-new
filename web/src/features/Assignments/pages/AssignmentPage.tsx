import { useState } from "react";
import { useGetUsersByRoleQuery } from "@/store/api/authApi";
import {
  useGetAllMentorAssignmentsQuery,
  useGetAllAdvisorAssignmentsQuery,
} from "@/store/api";
import { MentorAdvisorCard } from "../components";
import { AlertCircle } from "lucide-react";

export const AssignmentPage = () => {
  const [activeTab, setActiveTab] = useState<"mentors" | "advisors">("mentors");

  const { data: mentorsData, isLoading: mentorsLoading } =
    useGetUsersByRoleQuery("MENTOR");
  const { data: advisorsData, isLoading: advisorsLoading } =
    useGetUsersByRoleQuery("ADVISOR");

  const { data: mentorAssignmentsData } = useGetAllMentorAssignmentsQuery();
  const { data: advisorAssignmentsData } = useGetAllAdvisorAssignmentsQuery();

  const mentors = mentorsData?.data || [];
  const advisors = advisorsData?.data || [];
  const mentorAssignments = mentorAssignmentsData?.data || [];
  const advisorAssignments = advisorAssignmentsData?.data || [];

  const getMentorAssignmentCount = (mentorId: string) => {
    return mentorAssignments.filter((a) => a.mentorId === mentorId).length;
  };

  const getAdvisorAssignmentCount = (advisorId: string) => {
    return advisorAssignments.filter((a) => a.advisorId === advisorId).length;
  };

  const isLoading = activeTab === "mentors" ? mentorsLoading : advisorsLoading;
  const isEmpty =
    activeTab === "mentors" ? mentors.length === 0 : advisors.length === 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Assign Mentors & Advisors
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage student assignments to mentors and advisors
        </p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("mentors")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "mentors"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mentors
        </button>
        <button
          onClick={() => setActiveTab("advisors")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "advisors"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Advisors
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                No {activeTab === "mentors" ? "Mentors" : "Advisors"} Found
              </h2>
              <p className="text-muted-foreground mt-2">
                There are no {activeTab === "mentors" ? "mentors" : "advisors"}{" "}
                in the system yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === "mentors"
              ? mentors.map((mentor) => (
                  <MentorAdvisorCard
                    key={mentor.id}
                    user={mentor}
                    type="mentor"
                    assignedCount={getMentorAssignmentCount(mentor.id)}
                  />
                ))
              : advisors.map((advisor) => (
                  <MentorAdvisorCard
                    key={advisor.id}
                    user={advisor}
                    type="advisor"
                    assignedCount={getAdvisorAssignmentCount(advisor.id)}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
