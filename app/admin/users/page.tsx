"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Ban,
  Loader2,
  Mail,
  MoreVertical,
  Shield,
  UserCheck,
} from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUrlFilter } from "@/hooks/useUrlFilter";
import { adminService } from "@/lib/api/admin.service";
import type { IUser, Role, UserStatus } from "@/types";

function AdminUsersContent() {
  const queryClient = useQueryClient();
  const { get, getNumber, setFilter } = useUrlFilter();

  const searchQuery = get("search", "");
  const roleFilter = get("role", "ALL") as Role | "ALL";
  const statusFilter = get("status", "ALL") as UserStatus | "ALL";
  const currentPage = getNumber("page", 1);

  // Modal states for role change & status toggle
  const [roleModalUser, setRoleModalUser] = useState<IUser | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<Role>("DONOR");

  const [statusModalUser, setStatusModalUser] = useState<IUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin",
      "users",
      {
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
        page: currentPage,
      },
    ],
    queryFn: () =>
      adminService.getAllUsers({
        search: searchQuery || undefined,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        page: currentPage,
        limit: 10,
      }),
  });

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      adminService.updateUserStatus(userId, status),
    onSuccess: (updated) => {
      toast.success(
        `User ${updated.name} has been ${updated.status === "ACTIVE" ? "unblocked" : "blocked"} successfully!`,
      );
      setStatusModalUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update user status";
      toast.error(msg);
    },
  });

  // Role mutation
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: (updated) => {
      toast.success(
        `Permissions updated: ${updated.name} is now ${updated.role}!`,
      );
      setRoleModalUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to change user role";
      toast.error(msg);
    },
  });

  const usersList = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="User Governance & Access"
        description="Monitor system accounts, alter security permissions, and enforce administrative moderation."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by name or email..."
            value={searchQuery}
            onSearch={(val: string) => setFilter("search", val)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(val) => setFilter("role", val)}
          >
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="DONOR">Donor</SelectItem>
              <SelectItem value="PATIENT">Patient</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setFilter("status", val)}
          >
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={8} columns={5} />
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Users Found"
              description="No user accounts match the selected search terms and filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[280px]">User Account</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profile Summary</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((usr) => {
                  const isBlocked = usr.status === "BLOCKED";
                  const donor = usr.donorProfile;
                  const patient = usr.patientProfile;

                  return (
                    <TableRow key={usr.id} className="hover:bg-muted/20">
                      {/* Name & Email */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={usr.profileImage}
                              alt={usr.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {usr.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {usr.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3 shrink-0" />
                              {usr.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${
                            usr.role === "ADMIN" || usr.role === "SUPER_ADMIN"
                              ? "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : usr.role === "DONOR"
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {usr.role}
                        </Badge>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            isBlocked
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                              isBlocked ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                          />
                          {usr.status}
                        </Badge>
                      </TableCell>

                      {/* Profile Summary */}
                      <TableCell>
                        {donor ? (
                          <div className="flex items-center gap-2">
                            <BloodGroupBadge
                              group={donor.bloodGroup}
                              size="sm"
                            />
                            <span className="text-xs text-muted-foreground">
                              {donor.district || "—"} ({donor.totalDonations}{" "}
                              donations)
                            </span>
                          </div>
                        ) : patient ? (
                          <span className="text-xs text-muted-foreground">
                            {patient.hospitalName || "General Patient"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Standard Account
                          </span>
                        )}
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(usr.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Dropdown Action Menu */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs">
                              Manage User
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => {
                                setRoleModalUser(usr);
                                setSelectedNewRole(usr.role);
                              }}
                              className="text-xs cursor-pointer"
                            >
                              <Shield className="h-3.5 w-3.5 mr-2 text-purple-600" />
                              Modify Role
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setStatusModalUser(usr)}
                              className={`text-xs cursor-pointer ${
                                isBlocked
                                  ? "text-emerald-600"
                                  : "text-destructive"
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <UserCheck className="h-3.5 w-3.5 mr-2" />
                                  Unblock Account
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3.5 w-3.5 mr-2" />
                                  Block Account
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Bar */}
        {(meta.totalPages ?? 1) > 1 && (
          <div className="p-4 border-t border-border/40">
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages ?? 1}
              total={meta.total}
            />
          </div>
        )}
      </div>

      {/* Role Change Dialog */}
      <Dialog
        open={!!roleModalUser}
        onOpenChange={(open) => !open && setRoleModalUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading text-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              Update User Role
            </DialogTitle>
            <DialogDescription>
              Assign new system permissions to {roleModalUser?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-xs space-y-1">
              <p className="font-semibold text-foreground">
                Current Role:{" "}
                <Badge variant="outline" className="text-xs ml-1">
                  {roleModalUser?.role}
                </Badge>
              </p>
              <p className="text-muted-foreground">
                Email: {roleModalUser?.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="new-role-select"
                className="text-xs font-semibold text-foreground"
              >
                Select New Role
              </Label>
              <Select
                value={selectedNewRole}
                onValueChange={(val) => setSelectedNewRole(val as Role)}
              >
                <SelectTrigger id="new-role-select">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DONOR">
                    DONOR (Blood Donor Account)
                  </SelectItem>
                  <SelectItem value="PATIENT">
                    PATIENT (Blood Recipient)
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    ADMIN (Platform Administrator)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleModalUser(null)}
              disabled={roleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (roleModalUser) {
                  roleMutation.mutate({
                    userId: roleModalUser.id,
                    role: selectedNewRole,
                  });
                }
              }}
              disabled={
                roleMutation.isPending ||
                selectedNewRole === roleModalUser?.role
              }
            >
              {roleMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Toggle Modal */}
      <Dialog
        open={!!statusModalUser}
        onOpenChange={(open) => !open && setStatusModalUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {statusModalUser?.status === "BLOCKED"
                ? "Unblock User Account"
                : "Block User Account"}
            </DialogTitle>
            <DialogDescription>
              {statusModalUser?.status === "BLOCKED"
                ? `Restore access for ${statusModalUser?.name}? They will regain platform privileges immediately.`
                : `Are you sure you want to block ${statusModalUser?.name}? They will be immediately prevented from logging in or creating requests.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusModalUser(null)}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={
                statusModalUser?.status === "BLOCKED"
                  ? "default"
                  : "destructive"
              }
              onClick={() => {
                if (statusModalUser) {
                  const targetStatus =
                    statusModalUser.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
                  statusMutation.mutate({
                    userId: statusModalUser.id,
                    status: targetStatus,
                  });
                }
              }}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : statusModalUser?.status === "BLOCKED" ? (
                "Confirm Unblock"
              ) : (
                "Confirm Block"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <TableSkeleton rows={8} columns={5} />
        </div>
      }
    >
      <AdminUsersContent />
    </Suspense>
  );
}
