"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Droplet,
  FileText,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/lib/api/admin.service";

const BLOOD_GROUP_COLORS: Record<string, string> = {
  A_POSITIVE: "#e11d48",
  A_NEGATIVE: "#f43f5e",
  B_POSITIVE: "#be123c",
  B_NEGATIVE: "#fb7185",
  AB_POSITIVE: "#9f1239",
  AB_NEGATIVE: "#fecdd3",
  O_POSITIVE: "#881337",
  O_NEGATIVE: "#e11d48",
};

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: adminService.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const bloodGroupChartData =
    stats?.bloodGroupSupplyDistribution.map((item) => ({
      name: item.bloodGroup.replace("_", " "),
      rawGroup: item.bloodGroup,
      Donors: item.count,
    })) || [];

  const requestsFunnelData = stats
    ? [
        {
          stage: "Total Requests",
          count: stats.bloodRequests.total,
          fill: "#3b82f6",
        },
        {
          stage: "Pending Verification",
          count: stats.bloodRequests.pending,
          fill: "#f59e0b",
        },
        {
          stage: "Matched to Donor",
          count: stats.bloodRequests.matched,
          fill: "#8b5cf6",
        },
        {
          stage: "Fulfilled Transfusion",
          count: stats.bloodRequests.fulfilled,
          fill: "#10b981",
        },
      ]
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Administrative Overview"
        description="Real-time telemetry, donor inventory distribution, and hospital fulfillment analytics."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="border-border/60">
                <Users className="h-4 w-4 mr-1.5" />
                User Governance
              </Button>
            </Link>
            <Link href="/admin/audit-logs">
              <Button size="sm" variant="outline" className="border-border/60">
                <FileText className="h-4 w-4 mr-1.5" />
                Audit Logs
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Users"
          value={stats?.users.total || 0}
          hint={`${stats?.users.donors || 0} Donors, ${stats?.users.patients || 0} Patients`}
          icon={Users}
        />
        <StatCard
          label="Active Donors"
          value={stats?.users.donors || 0}
          hint="Verified ready-to-donate accounts"
          icon={UserCheck}
        />
        <StatCard
          label="Emergency Transfusions"
          value={stats?.bloodRequests.total || 0}
          hint={`${stats?.bloodRequests.fulfilled || 0} Fulfilled (${stats?.bloodRequests.fulfillmentRatePercentage || "0%"})`}
          icon={Droplet}
        />
        <StatCard
          label="Fund Contributions"
          value={`৳${(stats?.financials.totalRevenueCollected || 0).toLocaleString()}`}
          hint={`${stats?.financials.totalTransactions || 0} successful bKash payments`}
          icon={CircleDollarSign}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Blood Group Distribution */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                Blood Group Supply Distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Registered verified donors grouped by ABO/Rh blood type.
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-primary/5 text-primary"
            >
              Live Registry
            </Badge>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodGroupChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#88888820" }}
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#88888820" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Donors" radius={[6, 6, 0, 0]}>
                  {bloodGroupChartData.map((entry) => (
                    <Cell
                      key={entry.rawGroup}
                      fill={BLOOD_GROUP_COLORS[entry.rawGroup] || "#e11d48"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Request Fulfillment Funnel */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                Transfusion Pipeline Status
              </h3>
              <p className="text-xs text-muted-foreground">
                Progress breakdown across all patient blood requests.
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
            >
              {stats?.bloodRequests.fulfillmentRatePercentage || "0%"} Fulfilled
            </Badge>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={requestsFunnelData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  type="number"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#88888820" }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="stage"
                  type="category"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#88888820" }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {requestsFunnelData.map((entry) => (
                    <Cell key={entry.stage} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Administrative Action Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              User Governance
            </h4>
            <p className="text-xs text-muted-foreground">
              View all accounts, manage permissions, promote to administrator,
              or block accounts violating safety standards.
            </p>
          </div>
          <Link href="/admin/users">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Manage Users
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Security Audit Logs
            </h4>
            <p className="text-xs text-muted-foreground">
              Inspect immutable audit trail of role changes, administrative
              status updates, and user session actions.
            </p>
          </div>
          <Link href="/admin/audit-logs">
            <Button size="sm" variant="outline" className="w-full text-xs">
              View Audit Trail
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Public Emergency Directory
            </h4>
            <p className="text-xs text-muted-foreground">
              Review live emergency blood requests directly on the public
              directory to ensure information accuracy.
            </p>
          </div>
          <Link href="/requests">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Browse Directory
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
