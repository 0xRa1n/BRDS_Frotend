import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminInsights } from "@/components/admin/AdminInsights";
import { AdminRequestsTable } from "@/components/admin/AdminRequestsTable";
import { NewRequestModal } from "@/components/admin/NewRequestModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AdminDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRequestSuccess = () => {
    // Trigger a refresh of the table
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of barangay operations and document requests.</p>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>

          <div className="mb-6">
            <AdminStatsCards />
          </div>

          <AdminInsights />

          {/* We pass a key to force re-render/refetch when a new request is created */}
          <AdminRequestsTable key={refreshKey} />
        </div>
      </div>

      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
}
