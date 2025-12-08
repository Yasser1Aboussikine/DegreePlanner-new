import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { useGetAllCoursesQuery } from "@/store/api";
import CardLayout from "@/shared/CardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Course } from "@/store/types";

const StudentCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDiscipline, selectedCategory, itemsPerPage]);

  const {
    data: response,
    isLoading,
    error,
  } = useGetAllCoursesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    discipline: selectedDiscipline !== "all" ? selectedDiscipline : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const courses = response?.data || [];
  const pagination = response?.pagination;

  const { disciplines, categories } = useMemo(() => {
    const allDisciplines = new Set<string>();
    const allCategories = new Set<string>();

    courses.forEach((course: Course) => {
      course.disciplines?.forEach((d: string) => allDisciplines.add(d));
      course.categories?.forEach((c: string) => allCategories.add(c));
    });

    return {
      disciplines: Array.from(allDisciplines).sort(),
      categories: Array.from(allCategories).sort(),
    };
  }, [courses]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDiscipline("all");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    debouncedSearch !== "" ||
    selectedDiscipline !== "all" ||
    selectedCategory !== "all";

  const renderPaginationItems = () => {
    if (!pagination) return null;

    const items = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={page === 1}
            onClick={() => setCurrentPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
        <div className="flex items-center gap-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="9">9 per page</SelectItem>
                <SelectItem value="18">18 per page</SelectItem>
                <SelectItem value="27">27 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? "s" : ""} shown
            {pagination && ` of ${pagination.total} total`}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Filter & Search
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by course code, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Discipline
            </label>
            <Select
              value={selectedDiscipline}
              onValueChange={setSelectedDiscipline}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Disciplines" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline} value={discipline}>
                      {discipline}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">
          <p className="font-semibold">Error loading courses</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No courses found.</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear filters to see all courses
            </Button>
          )}
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.page > 1) {
                          setCurrentPage(pagination.page - 1);
                        }
                      }}
                      className={
                        pagination.page === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (pagination.page < pagination.totalPages) {
                          setCurrentPage(pagination.page + 1);
                        }
                      }}
                      className={
                        pagination.page >= pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
    navigate(`/student/courses/${course.id}`);
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
      <div className="flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description || "No description available"}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">Credits:</span>
          <span className="text-muted-foreground">
            {course.sch_credits || course.n_credits || "N/A"}
          </span>
        </div>

        {course.disciplines && course.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.disciplines.slice(0, 2).map((discipline, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-md"
              >
                {discipline}
              </span>
            ))}
            {course.disciplines.length > 2 && (
              <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">
                +{course.disciplines.length - 2} more
              </span>
            )}
          </div>
        )}

        {course.categories && course.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border">
            {course.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
              >
                {category}
              </span>
            ))}
            {course.categories.length > 2 && (
              <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">
                +{course.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Prerequisites: </span>
            {course.prerequisites.length} course
            {course.prerequisites.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </CardLayout>
    </div>
  );
};

export default StudentCourses;
