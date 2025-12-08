import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useGetMeQuery,
} from "@/store/api/authApi";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users as UsersIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ROLES = ["STUDENT", "ADMIN", "ADVISOR", "MENTOR", "REGISTRAR"];
const PAGE_SIZE = 10;

export const UsersPage = () => {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  const { data: currentUser } = useGetMeQuery();
  const {
    data: usersData,
    isLoading,
    error,
  } = useGetAllUsersQuery(
    {
      role: roleFilter === "ALL" ? undefined : roleFilter,
      search: searchQuery || undefined,
      page: currentPage,
      limit: PAGE_SIZE,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] =
    useToggleUserStatusMutation();

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.totalPages || 1;
  const total = usersData?.data?.total || 0;

  const handleRoleChange = (userId: string, newRole: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    setSelectedUser({
      id: userId,
      name: targetUser.name || targetUser.email,
      email: targetUser.email,
      currentRole: targetUser.role,
      newRole: newRole,
    });
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    const toastId = toast.loading(`Updating role for ${selectedUser.name}...`);

    try {
      await updateUserRole({
        userId: selectedUser.id,
        role: selectedUser.newRole,
      }).unwrap();
      toast.success(
        `Role updated successfully! ${selectedUser.name} is now a ${selectedUser.newRole}. They must log out and log back in for changes to take effect.`,
        { id: toastId, duration: 5000 }
      );
    } catch (error: any) {
      console.error("Error updating user role:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Unknown error occurred";
      toast.error(`Failed to update user role: ${errorMessage}`, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setSelectedUser(null);
    }
  };

  const cancelRoleChange = () => {
    setSelectedUser(null);
  };

  const handleToggleStatus = async (
    userId: string,
    currentStatus: boolean,
    userName: string
  ) => {
    if (currentUser?.id === userId) {
      toast.error("You cannot change your own status");
      return;
    }

    const toastId = toast.loading(
      `${currentStatus ? "Deactivating" : "Activating"} ${userName}...`
    );

    try {
      await toggleUserStatus(userId).unwrap();
      toast.success(
        `${userName} has been ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`,
        { id: toastId, duration: 3000 }
      );
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Unknown error occurred";
      toast.error(`Failed to update user status: ${errorMessage}`, {
        id: toastId,
        duration: 5000,
      });
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}/profile`);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Error Loading Users
          </h2>
          <p className="text-muted-foreground mt-2">
            Failed to load users. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage all users and their roles in the system
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-input border-border text-foreground">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(roleFilter !== "ALL" || searchQuery) && (
          <Button
            onClick={() => {
              setRoleFilter("ALL");
              setSearchQuery("");
              setCurrentPage(1);
            }}
            variant="outline"
            className="bg-background border-border text-foreground hover:bg-accent"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No Users Found
            </h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-card-foreground font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-card-foreground font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-card-foreground font-semibold">
                    Major
                  </TableHead>
                  <TableHead className="text-card-foreground font-semibold">
                    Classification
                  </TableHead>

                  <TableHead className="text-card-foreground font-semibold">
                    Assigned Students
                  </TableHead>
                  <TableHead className="text-card-foreground font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-card-foreground font-semibold">
                    Role
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        onClick={() => handleUserClick(user.id)}
                        className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                      >
                        {user.name || "N/A"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.major || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.classification || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.role === "MENTOR" &&
                      (user.mentorAssignmentCount ?? 0) > 0
                        ? user.mentorAssignmentCount
                        : user.role === "ADVISOR" &&
                          (user.advisorAssignmentCount ?? 0) > 0
                        ? user.advisorAssignmentCount
                        : "-"}
                    </TableCell>{" "}
                    <TableCell>
                      {currentUser?.id === user.id ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              user.id,
                              user.isActive,
                              user.name || user.email
                            )
                          }
                          disabled={isTogglingStatus}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      {currentUser?.id === user.id ? (
                        <span className="text-muted-foreground">
                          {user.role}
                        </span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(newRole) =>
                            handleRoleChange(user.id, newRole)
                          }
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-[140px] bg-input border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, total)} of {total} users
            </p>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
            )}
          </div>
        </>
      )}

      <AlertDialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && cancelRoleChange()}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">
              Confirm Role Change
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground space-y-2">
              <p>
                Are you sure you want to change the role for{" "}
                <span className="font-semibold text-foreground">
                  {selectedUser?.name}
                </span>
                ?
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  {selectedUser?.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Current role:
                  </span>{" "}
                  {selectedUser?.currentRole}
                </p>
                <p>
                  <span className="font-medium text-foreground">New role:</span>{" "}
                  {selectedUser?.newRole}
                </p>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Important Notice
                </p>
                <p className="text-xs mt-1">
                  The user will need to log out and log back in for the role
                  change to take effect. Their current session will continue
                  with the old role until they re-authenticate.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelRoleChange}
              className="bg-background border-border text-foreground hover:bg-accent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
