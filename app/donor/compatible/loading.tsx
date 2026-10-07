import {
  CardGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompatibleRequestsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <CardGridSkeleton count={6} />
    </div>
  );
}
