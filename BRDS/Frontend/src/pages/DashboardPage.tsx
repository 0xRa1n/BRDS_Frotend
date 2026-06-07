import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  User,
  Pencil,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ProfileEditModal } from "@/components/dashboard/ProfileEditModal";
import { toast } from "sonner";

export function DashboardPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, ready: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch profile and initial requests
      const [profileRes, requestsRes] = await Promise.all([
        api.user.getProfile().catch(() => null), // If profile fails, it might be unauthenticated
        api.request.getList(1, 10).catch(() => ({ data: [], total: 0 })),
      ]);

      if (profileRes) {
        setProfile(profileRes);
      } else {
        // Handle unauthenticated case by redirecting to login
        toast.error("Please login to view your dashboard");
        navigate("/verify", { state: { next: "/dashboard" } });
        return;
      }

      const reqs = requestsRes.data || [];
      setRequests(reqs);
      setHasMore(reqs.length === 10);
      calculateStats(reqs); // Or backend might provide stats
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (reqs: any[]) => {
    let active = 0,
      ready = 0,
      completed = 0;
    reqs.forEach((r) => {
      const status = r.status?.toLowerCase() || "";
      if (status === "ready for pickup") ready++;
      else if (status === "released") completed++;
      else active++;
    });
    setStats({ active, ready, completed });
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await api.request.getList(nextPage, 10);
      const newReqs = res.data || [];

      setRequests((prev) => [...prev, ...newReqs]);
      setPage(nextPage);
      setHasMore(newReqs.length === 10);
    } catch (error: any) {
      toast.error(error.message || "Failed to load more requests");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getStatusPill = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "ready for pickup") {
      return (
        <div className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Pickup
        </div>
      );
    } else if (s === "released") {
      return (
        <div className="px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" /> Released
        </div>
      );
    } else if (s === "needs update" || s === "review") {
      return (
        <div className="px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> Needs Update
        </div>
      );
    } else {
      return (
        <div className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-semibold flex items-center gap-1.5 capitalize">
          <Clock className="w-3.5 h-3.5 text-gray-400" />{" "}
          {status || "Submitted"}
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || "User";

  return (
    <div className="flex-1 bg-white py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header Card */}
        <div className="bg-emerald-500 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-600/20 shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">
                  Kumusta, {firstName}!
                </h1>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-6 h-6 rounded-full bg-emerald-400/40 flex items-center justify-center hover:bg-emerald-400/60 transition-colors"
                >
                  <Pencil className="w-3 h-3 text-white" />
                </button>
              </div>
              <p className="text-emerald-100 text-sm mt-1">
                {profile?.address || "Address not set"} |{" "}
                {profile?.phone_number || ""}
              </p>
            </div>
          </div>
          <Button
            className="bg-white text-emerald-600 hover:bg-gray-50 border-0 rounded-lg shadow-sm w-full sm:w-auto h-11 px-6 font-semibold flex items-center gap-2 shrink-0"
            onClick={() => navigate("/request")}
          >
            <Plus className="w-4 h-4" />
            Bagong Request
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Ready for Pickup</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        {/* Past Requests Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Mga Nakaraang Request
            </h2>
            <Link 
              to="/dashboard/requests" 
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              Tingnan Lahat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Wala ka pang request. Mag-click ng "Bagong Request" para
                magsimula.
              </div>
            ) : (
              requests.map((req) => {
                const createdAt = req.created_at || req.CreatedAt;
                const dateString = createdAt
                  ? new Date(createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <div
                    key={req.reference_number || req.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    onClick={() =>
                      navigate(`/track/${req.reference_number || req.id}`)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 capitalize">
                          {req.document_type?.replace(/-/g, " ") || "Document"}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateString}
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            REF:
                            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono tracking-tight">
                              {req.reference_number || req.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto ml-16 sm:ml-0">
                      {getStatusPill(req.status)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {hasMore && (
            <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
              <Button
                variant="ghost"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium"
              >
                {isLoadingMore ? "Loading..." : "Load More Requests"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSuccess={(updatedProfile) => setProfile(updatedProfile)}
      />
    </div>
  );
}
