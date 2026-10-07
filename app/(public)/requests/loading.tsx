import {
  CardGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/Skeletons";

export default function RequestsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <PageHeaderSkeleton />
      <div className="h-10 w-full max-w-md rounded-lg bg-muted animate-pulse" />
      <CardGridSkeleton count={6} />
    </div>
  );
}
