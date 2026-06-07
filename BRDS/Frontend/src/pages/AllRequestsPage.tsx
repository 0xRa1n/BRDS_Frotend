import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/lib/api";

export function AllRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const res = await api.request.getList(page, limit);
        setRequests(res.data || []);
        // For demonstration assuming total is returned, otherwise guess based on length
        // We'll assume the API returns { data: [...], total: 10 }
        setTotal(res.total || 0); 
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [page]);

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
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Needs Update
          </div>
          <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 border border-red-500 rounded-sm inline-block flex items-center justify-center">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            </span>
            I-cancel ang Request
          </span>
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

  const totalPages = Math.ceil(total / limit) || 1;
  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  return (
    <div className="flex-1 bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lahat ng Nakaraang Request</h1>
            <p className="text-gray-500 text-sm">Kasaysayan ng iyong mga transaksyon sa barangay</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
          
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {requests.length === 0 && !isLoading ? (
              <div className="p-12 text-center text-gray-500">
                Wala pang nakaraang request.
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
                    onClick={() => navigate(`/track/${req.reference_number || req.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
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

          {!isLoading && total > 0 && (
            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Pinapakita ang <span className="font-semibold text-gray-900">{startEntry}</span> hanggang <span className="font-semibold text-gray-900">{endEntry}</span> ng <span className="font-semibold text-gray-900">{total}</span> entries
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                      page === i + 1 
                        ? "bg-emerald-500 text-white border border-emerald-500" 
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
