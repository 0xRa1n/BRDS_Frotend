import { LayoutDashboard, Calendar, Settings, ChevronLeft, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    navigate("/admin/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Calendar, label: "Schedule", path: "/admin/schedule" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="w-64 bg-[#1b2b48] text-white flex flex-col h-screen shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1b2b48] font-bold mr-3">
          BC
        </div>
        <span className="font-bold text-lg">BarangayConnect</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors w-full">
          <ChevronLeft className="w-4 h-4" />
          Collapse Menu
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
