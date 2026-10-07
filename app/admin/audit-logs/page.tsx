"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe, Lock } from "lucide-react";
import { Suspense, useMemo } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { Badge } from "@/components/ui/badge";
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

function getActionColor(action: string) {
  if (action.includes("BLOCK") || action.includes("DELETE")) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (action.includes("ROLE") || action.includes("ADMIN")) {
    return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
  }
  if (
    action.includes("CREATE") ||
    action.includes("ACCEPTED") ||
    action.includes("COMPLETE")
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
}

function AuditLogsContent() {
  const { get, getNumber, setFilter } = useUrlFilter();

  const searchQuery = get("search", "");
  const currentPage = getNumber("page", 1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit-logs", { page: currentPage }],
    queryFn: () =>
      adminService.getAuditLogs({
        page: currentPage,
        limit: 15,
      }),
  });

  const logsList = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  };

  // Search filtering
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logsList;
    const q = searchQuery.toLowerCase();
    return logsList.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        Boolean(log.user?.email?.toLowerCase().includes(q)) ||
        Boolean(log.user?.name?.toLowerCase().includes(q)) ||
        Boolean(log.ipAddress?.toLowerCase().includes(q)),
    );
  }, [logsList, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Audit Logs & System Activity"
        description="Immutable compliance audit trail documenting administrative modifications, role alterations, and sensitive operations."
      />

      {/* Search Input */}
      <div className="w-full md:w-80">
        <SearchInput
          placeholder="Filter by action, user, or details..."
          value={searchQuery}
          onSearch={(val: string) => setFilter("search", val)}
        />
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={10} columns={4} />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Audit Logs Recorded"
              description={
                searchQuery
                  ? "No activity logs match your search filter."
                  : "Audit trails will appear here automatically when administrative operations occur."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[180px]">Action</TableHead>
                  <TableHead className="w-[220px]">Actor / Account</TableHead>
                  <TableHead>Event Details</TableHead>
                  <TableHead className="w-[150px]">IP Origin</TableHead>
                  <TableHead className="w-[180px] text-right">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/20">
                    {/* Action */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-mono tracking-tight font-semibold ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>

                    {/* Actor */}
                    <TableCell>
                      {log.user ? (
                        <div>
                          <p className="font-semibold text-xs text-foreground">
                            {log.user.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {log.user.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          System / Automated
                        </span>
                      )}
                    </TableCell>

                    {/* Details */}
                    <TableCell>
                      <p className="text-xs text-foreground/90 font-mono text-[11px] bg-muted/30 p-2 rounded-lg border border-border/30 line-clamp-2">
                        {log.details}
                      </p>
                    </TableCell>

                    {/* IP */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                        {log.ipAddress || "127.0.0.1"}
                      </span>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
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
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <TableSkeleton rows={10} columns={4} />
        </div>
      }
    >
      <AuditLogsContent />
    </Suspense>
  );
}
