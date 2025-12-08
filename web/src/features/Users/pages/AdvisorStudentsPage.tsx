import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStudentsByAdvisorIdQuery } from "@/store/api/advisorAssignmentApi";
import { useAppSelector } from "@/store/hooks";
import { SearchBar } from "@/shared/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const AdvisorStudentsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading, error } = useGetStudentsByAdvisorIdQuery(
    user?.id || "",
    {
      skip: !user?.id,
    }
  );

  const students = data?.data || [];

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.major?.toLowerCase().includes(query) ||
        student.classification?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // Paginate filtered students
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case "FRESHMAN":
        return "bg-blue-100 text-blue-800";
      case "SOPHOMORE":
        return "bg-green-100 text-green-800";
      case "JUNIOR":
        return "bg-yellow-100 text-yellow-800";
      case "SENIOR":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load students</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Advisees</h1>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {filteredStudents.length} Advisee
          {filteredStudents.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Students & Mentors</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            View all students and mentors assigned to you. Mentors are students
            with part-time mentoring roles.
          </p>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email, major, or classification..."
            className="max-w-md mt-4"
          />
        </CardHeader>
        <CardContent>
          {paginatedStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mb-4" />
              <p className="text-lg">
                {searchQuery
                  ? "No students or mentors found matching your search"
                  : "No students or mentors assigned yet"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Major</TableHead>
                    <TableHead>Minor</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Expected Graduation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div
                          onClick={() =>
                            navigate(`/advisor/students/${student.id}/profile`)
                          }
                          className="cursor-pointer text-primary hover:text-primary/80 hover:underline"
                        >
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.role === "MENTOR" ? "default" : "secondary"
                          }
                        >
                          {student.role || "STUDENT"}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.major || "N/A"}</TableCell>
                      <TableCell>{student.minor || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getClassificationColor(
                            student.classification ?? undefined
                          )}
                        >
                          {student.classification || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.joinDate
                          ? new Date(student.joinDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {student.expectedGraduation
                          ? new Date(
                              student.expectedGraduation
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const previousPage = array[index - 1];
                          const showEllipsis =
                            previousPage && page - previousPage > 1;

                          return (
                            <>
                              {showEllipsis && (
                                <PaginationItem key={`ellipsis-${page}`}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </>
                          );
                        })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorStudentsPage;
