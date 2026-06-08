import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export function AdminHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New Request",
      desc: "Juan Dela Cruz requested a Barangay Clearance.",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Meeting Reminder",
      desc: "Staff meeting in 15 minutes.",
      time: "15m ago",
      unread: true,
    },
    {
      id: 3,
      title: "System Update",
      desc: "Portal maintenance scheduled for midnight.",
      time: "2h ago",
      unread: false,
    },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-40">
      <h2 className="text-gray-500 text-sm font-medium">Dashboard</h2>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button className="text-xs text-emerald-600 font-medium hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    {notif.unread && (
                      <span className="absolute top-5 left-4 w-2 h-2 bg-emerald-500 rounded-full"></span>
                    )}
                    <div className={`${notif.unread ? 'pl-5' : ''}`}>
                      <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                      <p className="text-gray-500 text-sm mt-0.5">{notif.desc}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-white text-center border-t border-gray-50">
                <button className="text-sm text-emerald-600 font-medium hover:underline">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">Maria Santos</p>
            <p className="text-xs text-gray-500">Front Desk Staff</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
            MS
          </div>
        </div>
      </div>
    </div>
  );
}
