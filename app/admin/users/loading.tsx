import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
