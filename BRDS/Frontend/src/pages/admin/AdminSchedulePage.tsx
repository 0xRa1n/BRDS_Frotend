import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminScheduleList } from "@/components/admin/schedule/AdminScheduleList";
import { AdminScheduleCalendar } from "@/components/admin/schedule/AdminScheduleCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewRequestModal } from "@/components/admin/NewRequestModal";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function AdminSchedulePage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We fetch ALL confirmed/scheduled requests for caching
  const { data: res, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["adminRequests", "All"],
    queryFn: () => api.admin.getRequests("All"),
  });

  const requests = res?.data || [];
  // Filter only those with appointment_date
  const scheduledRequests = requests.filter((r: any) => r.appointment_date);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments Schedule</h1>
              <p className="text-sm text-gray-500 mt-1">Manage resident appointments for document pickup and processing.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setView("list")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  List View
                </button>
                <button 
                  onClick={() => setView("calendar")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Calendar View
                </button>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            {view === "list" ? (
              <AdminScheduleList requests={scheduledRequests} isLoading={isLoading} isFetching={isFetching} refetch={refetch} />
            ) : (
              <AdminScheduleCalendar requests={scheduledRequests} isLoading={isLoading} isFetching={isFetching} refetch={refetch} />
            )}
          </div>
        </div>
      </div>
      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => { refetch(); setIsModalOpen(false); }} 
      />
    </div>
  );
}
