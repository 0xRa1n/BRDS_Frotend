import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminArchivedAdminsTable } from "@/components/admin/AdminArchivedAdminsTable";
import { AdminArchivedPortalUsersTable } from "@/components/admin/AdminArchivedPortalUsersTable";

export function AdminArchivesPage() {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Archives</h1>
              <p className="text-sm text-gray-500 mt-1">Manage deleted admin, staff, and portal user accounts.</p>
            </div>
          </div>

          <AdminArchivedAdminsTable />
          
          <AdminArchivedPortalUsersTable />
        </div>
      </div>
    </div>
  );
}
