import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CardLayout from "@/shared/CardLayout";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateCourseMutation } from "@/store/api";
import type { CreateCourseInput } from "@/store/types";

interface CourseFormProps {
  basePath: string;
}

const CourseForm = ({ basePath }: CourseFormProps) => {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [formData, setFormData] = useState<CreateCourseInput>({
    course_code: "",
    course_title: "",
    description: "",
    sch_credits: 0,
    n_credits: 0,
    isElective: false,
    isMinorElective: false,
    isSpecElective: false,
    categories: [],
    disciplines: [],
    labels: ["Course"],
    prerequisites: [],
    dependents: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [newDiscipline, setNewDiscipline] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_code) {
      toast.error("Course code is required");
      return;
    }

    if (!formData.course_code.match(/^[A-Z]{3}\d{4}$|^[A-Z]{2,4}\d{3,4}$/)) {
      toast.error("Course code must be in format like CSC3309, ENG1201, etc.");
      return;
    }

    if (!formData.course_title) {
      toast.error("Course title is required");
      return;
    }

    if (!formData.description) {
      toast.error("Description is required");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("At least one category is required");
      return;
    }

    if (formData.disciplines.length === 0) {
      toast.error("At least one discipline is required");
      return;
    }

    const toastId = toast.loading("Creating course...");

    try {
      const courseData = {
        ...formData,
        id: `COURSE_${formData.course_code.toUpperCase()}`,
      };

      await createCourse(courseData).unwrap();

      toast.success("Course created successfully!", { id: toastId });
      navigate(basePath);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to create course";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== category),
    });
  };

  const addDiscipline = () => {
    if (newDiscipline.trim() && !formData.disciplines.includes(newDiscipline.trim())) {
      setFormData({
        ...formData,
        disciplines: [...formData.disciplines, newDiscipline.trim()],
      });
      setNewDiscipline("");
    }
  };

  const removeDiscipline = (discipline: string) => {
    setFormData({
      ...formData,
      disciplines: formData.disciplines.filter((d) => d !== discipline),
    });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites?.includes(newPrerequisite.trim())) {
      setFormData({
        ...formData,
        prerequisites: [...(formData.prerequisites || []), newPrerequisite.trim()],
      });
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (prereq: string) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites?.filter((p) => p !== prereq),
    });
  };

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, newLabel.trim()],
      });
      setNewLabel("");
    }
  };

  const removeLabel = (label: string) => {
    if (label === "Course") {
      toast.error("Cannot remove the default 'Course' label");
      return;
    }
    setFormData({
      ...formData,
      labels: formData.labels.filter((l) => l !== label),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          onClick={() => navigate(basePath)}
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground mt-1">
            Add a new course to the catalog
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CardLayout title="Basic Information">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Course Code <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.course_code}
                  onChange={(e) =>
                    setFormData({ ...formData, course_code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., CSC3309"
                  className="bg-input border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: 3 letters + 4 digits (e.g., CSC3309)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Course Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.course_title}
                  onChange={(e) =>
                    setFormData({ ...formData, course_title: e.target.value })
                  }
                  placeholder="e.g., Data Structures and Algorithms"
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Schedule Credits <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sch_credits}
                  onChange={(e) =>
                    setFormData({ ...formData, sch_credits: Number(e.target.value) })
                  }
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Normal Credits <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.n_credits}
                  onChange={(e) =>
                    setFormData({ ...formData, n_credits: Number(e.target.value) })
                  }
                  className="bg-input border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter course description..."
                className="bg-input border-border min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isElective}
                    onChange={(e) =>
                      setFormData({ ...formData, isElective: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">Elective Course</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMinorElective}
                    onChange={(e) =>
                      setFormData({ ...formData, isMinorElective: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">Minor Elective</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSpecElective}
                    onChange={(e) =>
                      setFormData({ ...formData, isSpecElective: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">Specialization Elective</span>
                </label>
              </div>
            </div>
          </div>
        </CardLayout>

        <CardLayout title="Categories & Disciplines">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Categories <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                  placeholder="Add a category..."
                  className="bg-input border-border"
                />
                <Button type="button" onClick={addCategory} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Disciplines <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={newDiscipline}
                  onChange={(e) => setNewDiscipline(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDiscipline())}
                  placeholder="Add a discipline..."
                  className="bg-input border-border"
                />
                <Button type="button" onClick={addDiscipline} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.disciplines.map((discipline) => (
                  <Badge key={discipline} variant="outline" className="gap-1">
                    {discipline}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeDiscipline(discipline)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardLayout>

        <CardLayout title="Labels">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Neo4j Labels
            </label>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLabel())}
                placeholder="Add a label..."
                className="bg-input border-border"
              />
              <Button type="button" onClick={addLabel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.labels.map((label) => (
                <Badge key={label} className="bg-primary/10 text-primary gap-1">
                  {label}
                  {label !== "Course" && (
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeLabel(label)}
                    />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Default 'Course' label cannot be removed
            </p>
          </div>
        </CardLayout>

        <CardLayout title="Prerequisites (Optional)">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Prerequisite Course Codes
            </label>
            <div className="flex gap-2">
              <Input
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
                placeholder="e.g., CSC2301"
                className="bg-input border-border"
              />
              <Button type="button" onClick={addPrerequisite} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.prerequisites?.map((prereq) => (
                <Badge key={prereq} variant="secondary" className="gap-1">
                  {prereq}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removePrerequisite(prereq)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardLayout>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(basePath)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
