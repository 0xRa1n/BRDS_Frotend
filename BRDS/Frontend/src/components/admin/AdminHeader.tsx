import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function AdminHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = localStorage.getItem("admin_full_name") || "User";
  const role = localStorage.getItem("admin_role") || "Staff";

  // Generate initials (e.g. "Maria Santos" -> "MS")
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(fullName);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: requestsData } = useQuery({
    queryKey: ["admin_notifications"],
    queryFn: () => api.admin.getRequests("Pending"),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const allRequests = requestsData?.data || [];
  
  // Sort requests by newest first
  const pendingRequests = [...allRequests].sort((a, b) => {
    return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
  });

  const lastReadTimeStr = localStorage.getItem("admin_notifications_last_read");
  const lastReadTime = lastReadTimeStr ? parseInt(lastReadTimeStr) : 0;

  // Check if there's any pending request created after lastReadTime
  const hasUnread = pendingRequests.some(req => new Date(req.CreatedAt).getTime() > lastReadTime);

  const handleToggleNotif = () => {
    if (!isNotifOpen && pendingRequests.length > 0) {
      // Set last read to the timestamp of the newest pending request to prevent clock skew issues
      const newestTime = new Date(pendingRequests[0].CreatedAt).getTime();
      localStorage.setItem("admin_notifications_last_read", newestTime.toString());
    } else if (!isNotifOpen) {
      localStorage.setItem("admin_notifications_last_read", Date.now().toString());
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-40">
      <h2 className="text-gray-500 text-sm font-medium">Dashboard</h2>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={handleToggleNotif}
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button className="text-xs text-emerald-600 font-medium hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {pendingRequests.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                ) : (
                  pendingRequests.slice(0, 5).map((req: any) => {
                    const isUnread = new Date(req.CreatedAt).getTime() > lastReadTime;
                    return (
                      <div key={req.ID} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                        {isUnread && (
                          <span className="absolute top-5 left-4 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        )}
                        <div className={`${isUnread ? 'pl-5' : ''}`}>
                          <h4 className="font-bold text-gray-900 text-sm">New Request</h4>
                          <p className="text-gray-500 text-sm mt-0.5">
                            {req.user?.full_name || "Someone"} requested a {req.document_type || "document"}.
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">{getTimeAgo(req.CreatedAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-3 bg-white text-center border-t border-gray-50">
                <button className="text-sm text-emerald-600 font-medium hover:underline">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{fullName}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}
