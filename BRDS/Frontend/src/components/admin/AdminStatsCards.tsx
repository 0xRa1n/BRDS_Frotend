import { useState, useEffect } from "react";
import { Inbox, Clock, CheckCircle2, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "@/lib/api";

export function AdminStatsCards() {
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    released: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.admin.getRequests("All");
        const reqs = res.data || [];
        setStatsData({
          total: reqs.length,
          pending: reqs.filter((r: any) => r.status?.toLowerCase() === "pending" || r.status?.toLowerCase() === "under review").length,
          approved: reqs.filter((r: any) => r.status?.toLowerCase() === "approved").length,
          released: reqs.filter((r: any) => r.status?.toLowerCase() === "released").length,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Requests",
      value: statsData.total.toString(),
      change: "+0%",
      isPositive: true,
      icon: Inbox,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Pending & Review",
      value: statsData.pending.toString(),
      change: "0%",
      isPositive: false,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Approved",
      value: statsData.approved.toString(),
      change: "+0%",
      isPositive: true,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Released",
      value: statsData.released.toString(),
      change: "+0%",
      isPositive: true,
      icon: FileText,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.iconBg}`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
