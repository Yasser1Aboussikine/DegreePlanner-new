import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X, Plus } from "lucide-react";
import { useGetAllCoursesQuery } from "@/store/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import CardLayout from "@/shared/CardLayout";
import { matchesCourseOrTitle } from "@/utils/searchHelpers";
import type { Course } from "@/store/types";

const RegistrarCourses = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useGetAllCoursesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDiscipline, selectedCategory, selectedType]);

  const disciplines = useMemo(() => {
    if (!courses?.data) return [];
    const uniqueDisciplines = new Set<string>();
    courses.data.forEach((course: Course) => {
      course.disciplines?.forEach((d: any) => uniqueDisciplines.add(d.name));
    });
    return Array.from(uniqueDisciplines).sort();
  }, [courses]);

  const categories = useMemo(() => {
    if (!courses?.data) return [];
    const uniqueCategories = new Set<string>();
    courses.data.forEach((course: Course) => {
      course.categories?.forEach((c: any) => uniqueCategories.add(c.name));
    });
    return Array.from(uniqueCategories).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!courses?.data) return [];

    return courses.data.filter((course: Course) => {
      const matchesSearch =
        searchTerm === "" ||
        matchesCourseOrTitle(course.course_code, course.course_title, searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDiscipline =
        selectedDiscipline === "all" ||
        course.disciplines?.some((d: any) => d.name === selectedDiscipline);

      const matchesCategory =
        selectedCategory === "all" ||
        course.categories?.some((c: any) => c.name === selectedCategory);

      const matchesType =
        selectedType === "all" ||
        (selectedType === "elective" && course.isElective) ||
        (selectedType === "required" && !course.isElective);

      return (
        matchesSearch && matchesDiscipline && matchesCategory && matchesType
      );
    });
  }, [courses, searchTerm, selectedDiscipline, selectedCategory, selectedType]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDiscipline("all");
    setSelectedCategory("all");
    setSelectedType("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDiscipline !== "all" ||
    selectedCategory !== "all" ||
    selectedType !== "all";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold mb-2">
            Error loading courses
          </p>
          <p className="text-muted-foreground">
            {error && "data" in error
              ? JSON.stringify(error.data)
              : "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground mt-1">
            Browse, create, edit, and manage all courses
          </p>
        </div>
        <Button onClick={() => navigate("create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Search & Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto gap-1 text-xs"
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by course code, title, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
            <SelectTrigger>
              <SelectValue placeholder="All Disciplines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Disciplines</SelectItem>
              {disciplines.map((discipline) => (
                <SelectItem key={discipline} value={discipline}>
                  {discipline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="required">Required</SelectItem>
              <SelectItem value="elective">Elective</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {paginatedCourses.length} of {filteredCourses.length} courses
          {hasActiveFilters && ` (filtered from ${courses?.data?.length || 0} total)`}
        </p>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No courses found</p>
          {hasActiveFilters && (
            <Button
              variant="link"
              onClick={clearFilters}
              className="mt-2"
            >
              Clear filters to see all courses
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  }
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/registrar/courses/${course.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <CardLayout
        title={
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-primary">
              {course.course_code}
            </span>
            <span className="text-base font-semibold text-card-foreground line-clamp-2">
              {course.course_title}
            </span>
          </div>
        }
        titleClassName="mb-3"
        className="h-full hover:shadow-lg transition-all hover:scale-[1.02]"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description || "No description available"}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="font-semibold">
              {course.sch_credits} Credits
            </Badge>
            <Badge variant={course.isElective ? "outline" : "default"}>
              {course.isElective ? "Elective" : "Required"}
            </Badge>
          </div>

          {course.disciplines && course.disciplines.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Disciplines
              </p>
              <div className="flex flex-wrap gap-1">
                {course.disciplines.map((discipline: any) => (
                  <Badge
                    key={discipline.id}
                    variant="outline"
                    className="text-xs"
                  >
                    {discipline.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.categories && course.categories.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Categories
              </p>
              <div className="flex flex-wrap gap-1">
                {course.categories.map((category: any) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="text-xs"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.prerequisites && course.prerequisites.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Prerequisites
              </p>
              <div className="flex flex-wrap gap-1">
                {course.prerequisites.map((prereq: any) => (
                  <Badge key={prereq.id} variant="secondary" className="text-xs">
                    {prereq.course_code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardLayout>
    </div>
  );
};

export default RegistrarCourses;
