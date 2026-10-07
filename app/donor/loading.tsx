import {
  CardGridSkeleton,
  PageHeaderSkeleton,
  StatCardsSkeleton,
} from "@/components/shared/Skeletons";

export default function DonorDashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={4} />
      <CardGridSkeleton count={3} />
    </div>
  );
}
