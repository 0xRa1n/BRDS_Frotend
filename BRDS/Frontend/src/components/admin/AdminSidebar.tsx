import { useState } from "react";
import { LayoutDashboard, Calendar, Settings, ChevronLeft, ChevronRight, LogOut, Users, Archive } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const role = localStorage.getItem("admin_role");
  const isAdmin = role && role.toLowerCase() === "admin";

  const handleLogout = () => {
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_full_name");
    navigate("/admin/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Calendar, label: "Schedule", path: "/admin/schedule" },
    // Only show User Management and Archives for admins
    ...(isAdmin ? [
      { icon: Users, label: "User Management", path: "/admin/users" },
      { icon: Archive, label: "Archives", path: "/admin/archives" }
    ] : []),
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className={`bg-emerald-600 text-white flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"} overflow-hidden`}>
      <div className="h-16 flex items-center border-b border-white/10 shrink-0 px-6">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold shrink-0">
          BC
        </div>
        <span className={`font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}`}>BarangayConnect</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors overflow-hidden ${
                isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 py-2 px-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors w-full overflow-hidden"
          title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
          <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
            Collapse Menu
          </span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 px-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors w-full overflow-hidden"
          title={isCollapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
}
