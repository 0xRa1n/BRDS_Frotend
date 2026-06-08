import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AdminRequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminRequest", id],
    queryFn: () => api.admin.getRequest(id!),
    enabled: !!id,
  });

  const request = res?.data;

  const handleUpdateStatus = async (newStatus: string, remarks?: string) => {
    try {
      setIsUpdating(true);
      await api.admin.updateRequestStatus(id!, newStatus, remarks);
      toast.success(`Request status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading details...
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Request not found.
          </div>
        </div>
      </div>
    );
  }

  const submitDate = new Date(request.CreatedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusPillColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Released":
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Under Review":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Flagged":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Rejected":
      case "Missed":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStep2Props = () => {
    if (request.status === "Flagged") {
      return {
        title: "Flagged for Info",
        desc: request.remarks || "Action required from resident",
        icon: <AlertCircle className="w-4 h-4" />,
        color: "border-[#c26500] bg-orange-50 text-[#c26500]",
      };
    }
    if (request.status === "Rejected") {
      return {
        title: "Rejected",
        desc: request.remarks || "Request denied",
        icon: <X className="w-4 h-4" />,
        color: "border-red-300 bg-red-50 text-red-500",
      };
    }
    if (request.status === "Pending") {
      return {
        title: "Under Review",
        desc: "Waiting for processing",
        icon: <Clock className="w-4 h-4" />,
        color: "border-amber-300 bg-amber-50 text-amber-500",
      };
    }
    return {
      title: "Under Review",
      desc: "Processed",
      icon: <Check className="w-4 h-4" />,
      color: "border-emerald-200 bg-emerald-50 text-emerald-500",
    };
  };

  const step2 = getStep2Props();

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {request.reference_number}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${getStatusPillColor(request.status)}`}
              >
                {request.status === "Flagged" ? "FLAGGED FOR INFO" : request.status}
              </span>
            </div>
            <p className="text-gray-500">
              {request.document_type
                ? request.document_type.charAt(0).toUpperCase() +
                  request.document_type.slice(1)
                : ""}{" "}
              • Submitted {submitDate}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resident Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Resident Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {request.user?.full_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                    <p className="font-medium text-gray-900">
                      {request.user?.phone_number || "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-900">
                      Address not provided by DB model
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">
                      Purpose of Request
                    </p>
                    <p className="font-medium text-gray-900">
                      {request.purpose || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  Uploaded Documents
                </h2>

                <div>
                  <p className="text-sm text-gray-500 mb-3">Valid ID (Front)</p>
                  <div className="w-full max-w-sm aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 transition-colors hover:bg-gray-100">
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-300" />
                    <p className="font-medium">No image attached</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Timeline Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Request Timeline
                </h2>

                <div className="flex flex-col">
                  {/* Step 1 - Submitted */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full border-2 border-blue-200 bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div
                        className="w-px grow bg-gray-200 mt-2"
                        style={{ minHeight: "24px" }}
                      />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">
                        Submitted
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{submitDate}</p>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        System
                      </p>
                    </div>
                  </div>

                  {/* Step 2 - Dynamic */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${step2.color}`}
                      >
                        {step2.icon}
                      </div>
                      <div
                        className="w-px grow bg-gray-200 mt-2"
                        style={{ minHeight: "24px" }}
                      />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">
                        {step2.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step2.desc}</p>
                    </div>
                  </div>

                  {/* Step 3 - Approval */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${
                          ["Approved", "Released", "Confirmed"].includes(
                            request.status,
                          )
                            ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                            : "border-gray-200 bg-gray-50 text-gray-300"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="pt-1">
                      <p
                        className={`font-semibold text-sm leading-tight ${
                          ["Approved", "Released", "Confirmed"].includes(
                            request.status,
                          )
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        Approval
                      </p>
                      {!["Approved", "Released", "Confirmed"].includes(
                        request.status,
                      ) && (
                        <p className="text-xs text-gray-400 mt-1">Pending</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Actions
                </h2>
                <div className="flex flex-col">
                  {/* Mark Under Review */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Under Review")}
                    className="w-full flex items-center justify-start gap-4 px-6 py-4 mb-4 rounded-md border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Clock className="w-5 h-5 shrink-0" />
                    Mark Under Review
                  </button>

                  {/* Approve Request */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Approved")}
                    className="w-full flex items-center justify-start gap-4 px-6 py-4 mb-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 shrink-0" />
                    Approve Request
                  </button>

                  {/* Flag for Info */}
                  <button
                    disabled={isUpdating}
                    onClick={() => setIsFlagModalOpen(true)}
                    className="w-full flex items-center justify-start gap-4 px-6 py-4 mb-4 rounded-md border border-[#c26500] bg-white text-[#c26500] hover:bg-orange-50 transition-colors text-sm font-medium disabled:opacity-50"
                    style={{ borderColor: '#c26500', color: '#c26500' }}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    Flag for Info
                  </button>

                  {/* Reject */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-md border border-red-500 bg-white text-red-600 hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <X className="w-5 h-5 shrink-0" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag For Info Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Flag Request for Info</h2>
              <p className="text-sm text-gray-500 mt-1">Please provide a reason for flagging this request. This will be visible to the resident.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Flagging</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c26500]"
                  rows={4}
                  placeholder="E.g. The provided ID is blurry and cannot be read..."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => { setIsFlagModalOpen(false); setFlagReason(""); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                disabled={isUpdating || !flagReason.trim()}
                onClick={() => {
                  handleUpdateStatus("Flagged", flagReason);
                  setIsFlagModalOpen(false);
                  setFlagReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#c26500] rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {isUpdating ? "Flagging..." : "Confirm & Flag"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
