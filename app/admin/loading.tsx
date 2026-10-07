import {
  PageHeaderSkeleton,
  StatCardsSkeleton,
} from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={5} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
