import { useState } from "react";
import { Pencil, Ban, X, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface PortalUser {
  ID: number;
  phone_number: string;
  full_name: string;
  address: string;
  date_of_birth: string;
}

export function AdminPortalUsersTable() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);

  const { data: res, isLoading: loading, isFetching, refetch } = useQuery({
    queryKey: ['adminPortalUsers'],
    queryFn: () => api.admin.getPortalUsers()
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users = res?.data || [];
  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchUsers = () => refetch();

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      await api.admin.updatePortalUser(selectedUser.ID.toString(), payload);
      toast.success("Portal user updated successfully");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update portal user");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    try {
      await api.admin.deletePortalUser(selectedUser.ID.toString());
      toast.success("Portal user deleted successfully");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete portal user");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });
  };

  const formatUserId = (id: number) => {
    return id.toString().padStart(5, '0');
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading portal users...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-semibold text-gray-800">Registered Portal Users</h2>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Phone Number</th>
              <th className="p-4 font-medium">Date of Birth</th>
              <th className="p-4 font-medium">Address</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map((user: PortalUser) => (
              <tr key={user.ID} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-900">{formatUserId(user.ID)}</td>
                <td className="p-4 text-sm font-medium text-gray-900">{user.full_name}</td>
                <td className="p-4 text-sm text-gray-600">{user.phone_number}</td>
                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(user.date_of_birth)}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">{user.address}</td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Portal User"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Portal User"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No registered portal users found.
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

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Portal User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input type="text" readOnly value={formatUserId(selectedUser.ID)} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="fullName" defaultValue={selectedUser.full_name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="text" name="phoneNumber" defaultValue={selectedUser.phone_number} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input required type="text" name="dateOfBirth" defaultValue={selectedUser.date_of_birth.substring(0, 10)} placeholder="YYYY-MM-DD" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input required type="text" name="address" defaultValue={selectedUser.address} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Portal User?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedUser.full_name}</span>? This account will be archived.
              </p>
              <div className="flex justify-center gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button onClick={handleDeleteSubmit} className="bg-red-600 hover:bg-red-700 text-white">Delete User</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
