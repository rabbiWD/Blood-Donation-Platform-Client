import {
  PageHeaderSkeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";

export default function PatientLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={4} />
      <TableSkeleton rows={4} columns={5} />
    </div>
  );
}
