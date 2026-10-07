import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditLogsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <Skeleton className="h-10 w-80 rounded-xl" />
      <TableSkeleton rows={10} columns={4} />
    </div>
  );
}
