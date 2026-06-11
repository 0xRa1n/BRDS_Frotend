import { useState } from "react";
import { Eye, RefreshCw, RotateCcw, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface AdminUser {
  ID: number;
  uniqueId: string;
  fullName: string;
  username: string;
  role: string;
  loginHistory: string[] | null;
}

export function AdminArchivedAdminsTable() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: res, isLoading: loading, isFetching, refetch } = useQuery({
    queryKey: ['adminArchivedAdmins'],
    queryFn: () => api.admin.getArchivedAdmins()
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users = res?.data || [];
  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRecover = async (id: number) => {
    try {
      await api.admin.recoverAdmin(id.toString());
      toast.success("Staff account recovered successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to recover account");
    }
  };

  const formatLastLogin = (history: string[] | null) => {
    if (!history || history.length === 0) return "Never logged in";
    const last = new Date(history[history.length - 1]);
    return last.toLocaleString();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading archived accounts...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-semibold text-gray-800">Archived Staff Accounts</h2>
        <Button 
          onClick={() => refetch()}
          variant="outline"
          className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-medium">Unique ID</th>
              <th className="p-4 font-medium">Full Name</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Last Login</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map((user: AdminUser) => (
              <tr key={user.ID} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-900">{user.uniqueId}</td>
                <td className="p-4 text-sm text-gray-600">{user.fullName}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role.toLowerCase() === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatLastLogin(user.loginHistory)}
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setIsViewModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRecover(user.ID)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Recover Account"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No archived staff accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, users.length)} of {users.length}{" "}
            entries
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === i + 1
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Archived Staff Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
                <div className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg">{selectedUser.uniqueId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg">{selectedUser.fullName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg">{selectedUser.username}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg">{selectedUser.role}</div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                <Button onClick={() => {
                  handleRecover(selectedUser.ID);
                  setIsViewModalOpen(false);
                }} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Recover Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
