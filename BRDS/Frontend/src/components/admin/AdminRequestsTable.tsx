import { useState } from "react";
import { Eye, Check, Flag, RefreshCw, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SetAppointmentModal } from "./SetAppointmentModal";
import { useNavigate } from "react-router";

export function AdminRequestsTable() {
  const [activeTab, setActiveTab] = useState("All");
  const [appointmentRequest, setAppointmentRequest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tabs = ["All", "Pending", "Under Review", "Confirmed", "Released"];
  const navigate = useNavigate();

  const {
    data: res,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["adminRequests", activeTab],
    queryFn: () => api.admin.getRequests(activeTab),
  });

  const requests = res?.data || [];

  const getStatusPill = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "pending")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          Pending
        </span>
      );
    if (s === "under review" || s === "review")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          Under Review
        </span>
      );
    if (s === "approved" || s === "confirmed")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          Confirmed
        </span>
      );
    if (s === "released")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          Released
        </span>
      );
    if (s === "needs info")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          Needs Info
        </span>
      );
    if (s === "rejected")
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Rejected
        </span>
      );
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        {status}
      </span>
    );
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = requests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, requests.length);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="flex border-b border-gray-100 px-6 pt-2 justify-between items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Reference No.
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resident Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Submitted Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req: any) => {
                const dateString = new Date(req.CreatedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );
                return (
                  <tr
                    key={req.ID}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {req.reference_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {req.user?.full_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {req.document_type
                        ? req.document_type.charAt(0).toUpperCase() +
                          req.document_type.slice(1)
                        : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dateString}
                    </td>
                    <td className="px-6 py-4">{getStatusPill(req.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/requests/${req.ID}`)}
                          className="text-gray-400 hover:text-gray-900 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAppointmentRequest(req)}
                          className="text-emerald-500 hover:text-emerald-600 transition-colors"
                          title="Set Appointment"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-white rounded-b-xl">
        <p>
          Showing {startItem} to {endItem} of {requests.length} results
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 border rounded ${
                currentPage === page
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <SetAppointmentModal
        isOpen={!!appointmentRequest}
        onClose={() => setAppointmentRequest(null)}
        request={appointmentRequest}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
